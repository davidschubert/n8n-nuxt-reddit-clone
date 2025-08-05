<template>
  <div class="comment-thread">
    <!-- Comment Form -->
    <div
      v-if="canComment"
      class="mb-6"
    >
      <form
        class="bg-white rounded-lg shadow p-4"
        @submit.prevent="submitComment"
      >
        <textarea
          v-model="newComment"
          placeholder="Write a comment..."
          class="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          :disabled="isSubmitting"
        />
        <div class="flex justify-end mt-3">
          <button
            type="submit"
            :disabled="!newComment.trim() || isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Comments List -->
    <div class="space-y-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :current-user-id="currentUserId"
        :max-depth="maxDepth"
        @vote="handleVote"
        @reply="handleReply"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Load More Button -->
    <div
      v-if="hasMore"
      class="text-center mt-6"
    >
      <button
        :disabled="isLoading"
        class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        @click="loadMore"
      >
        {{ isLoading ? 'Loading...' : 'Load More Comments' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { commentService } from '~/services/comment.service'
import type { CommentWithReplies, CreateCommentInput, VoteCommentInput } from '~/types/comments'

interface Props {
  postId: string
  currentUserId?: string
  maxDepth?: number
  initialLimit?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 5,
  initialLimit: 20,
  currentUserId: undefined
})

// Reactive state
const comments = ref<CommentWithReplies[]>([])
const newComment = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const hasMore = ref(true)
const offset = ref(0)

// Computed
const canComment = computed(() => !!props.currentUserId)

// Methods
const loadComments = async (reset = false) => {
  if (isLoading.value) return

  isLoading.value = true
  
  try {
    const currentOffset = reset ? 0 : offset.value
    
    const newComments = await commentService.getCommentsForPost({
      postId: props.postId,
      limit: props.initialLimit,
      offset: currentOffset,
      sortBy: 'score',
      sortOrder: 'desc',
      maxDepth: props.maxDepth
    })

    if (reset) {
      comments.value = newComments
      offset.value = props.initialLimit
    } else {
      comments.value.push(...newComments)
      offset.value += props.initialLimit
    }

    hasMore.value = newComments.length === props.initialLimit
  } catch (error) {
    console.error('Failed to load comments:', error)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

const submitComment = async () => {
  if (!props.currentUserId || !newComment.value.trim()) return

  isSubmitting.value = true

  try {
    const commentInput: CreateCommentInput = {
      content: newComment.value.trim(),
      postId: props.postId
    }

    await commentService.createComment(props.currentUserId, commentInput)
    
    newComment.value = ''
    
    // Reload comments to show the new one
    await loadComments(true)
  } catch (error) {
    console.error('Failed to submit comment:', error)
    // Handle error
  } finally {
    isSubmitting.value = false
  }
}

const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
  if (!props.currentUserId) return

  try {
    const voteInput: VoteCommentInput = {
      commentId,
      voteType
    }

    await commentService.voteComment(props.currentUserId, voteInput)
    
    // Update local state or reload comments
    await loadComments(true)
  } catch (error) {
    console.error('Failed to vote:', error)
  }
}

const handleReply = async (parentId: string, content: string) => {
  if (!props.currentUserId) return

  try {
    const replyInput: CreateCommentInput = {
      content,
      postId: props.postId,
      parentCommentId: parentId
    }

    await commentService.createComment(props.currentUserId, replyInput)
    
    // Reload comments to show the new reply
    await loadComments(true)
  } catch (error) {
    console.error('Failed to submit reply:', error)
  }
}

const handleEdit = async (commentId: string, content: string) => {
  if (!props.currentUserId) return

  try {
    await commentService.updateComment(commentId, props.currentUserId, { content })
    
    // Update local state or reload
    await loadComments(true)
  } catch (error) {
    console.error('Failed to edit comment:', error)
  }
}

const handleDelete = async (commentId: string) => {
  if (!props.currentUserId) return

  try {
    await commentService.deleteComment(commentId, props.currentUserId)
    
    // Reload comments
    await loadComments(true)
  } catch (error) {
    console.error('Failed to delete comment:', error)
  }
}

const loadMore = () => {
  loadComments(false)
}

// Lifecycle
onMounted(() => {
  loadComments(true)
})
</script>

<style scoped>
.comment-thread {
  @apply max-w-4xl mx-auto;
}
</style>