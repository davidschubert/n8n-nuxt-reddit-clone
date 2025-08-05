<template>
  <section class="comments-section bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <header class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">
        Comments
        <span v-if="comments.length > 0" class="text-sm font-normal text-gray-500">
          ({{ comments.length }})
        </span>
      </h2>
    </header>

    <!-- New Comment Editor -->
    <div class="p-4 border-b border-gray-200">
      <CommentEditor
        :post-id="postId"
        :on-submit="handleNewComment"
        placeholder="Share your thoughts..."
      />
    </div>

    <!-- Comments List -->
    <div class="divide-y divide-gray-100">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-flex items-center space-x-2 text-gray-500">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading comments...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="text-red-600 mb-2">Failed to load comments</div>
        <button
          @click="retryLoad"
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="comments.length === 0" class="p-8 text-center text-gray-500">
        <div class="mb-2">No comments yet</div>
        <div class="text-sm">Be the first to share your thoughts!</div>
      </div>

      <!-- Comments -->
      <div v-else class="divide-y divide-gray-100">
        <CommentItem
          v-for="comment in sortedComments"
          :key="comment.id"
          :comment="comment"
          @update="handleUpdate"
          @delete="handleUpdate"
        />
      </div>
    </div>

    <!-- Load More (if pagination is needed) -->
    <div v-if="hasMore" class="p-4 text-center border-t border-gray-200">
      <button
        @click="loadMore"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        :disabled="loading"
      >
        Load more comments
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'

interface Props {
  postId: string
  autoLoad?: boolean
  sortBy?: 'newest' | 'oldest' | 'popular'
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
  sortBy: 'newest'
})

// State
const hasMore = ref(false)
const { comments, loading, error, fetchComments, createComment } = useComments()

// Computed
const sortedComments = computed(() => {
  const commentsCopy = [...comments.value]
  
  switch (props.sortBy) {
    case 'newest':
      return commentsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return commentsCopy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'popular':
      return commentsCopy.sort((a, b) => b.votes - a.votes)
    default:
      return commentsCopy
  }
})

// Methods
const handleNewComment = async (content: string) => {
  const newComment = await createComment({
    content,
    postId: props.postId
  })

  if (newComment) {
    // Comment was successfully created and added to the state
    console.log('New comment created:', newComment.id)
  }
}

const handleUpdate = () => {
  // Force reactivity update
  // In a real app, you might want to refetch specific comments
}

const retryLoad = () => {
  fetchComments(props.postId)
}

const loadMore = () => {
  // Implement pagination logic here
  console.log('Loading more comments...')
}

// Load comments on mount
onMounted(() => {
  if (props.autoLoad) {
    fetchComments(props.postId)
  }
})

// Watch for postId changes
watch(() => props.postId, (newPostId) => {
  if (newPostId && props.autoLoad) {
    fetchComments(newPostId)
  }
})
</script>