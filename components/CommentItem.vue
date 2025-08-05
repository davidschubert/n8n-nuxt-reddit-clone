<template>
  <article class="comment">
    <div class="flex space-x-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

      <!-- Comment Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-1">
          <span class="font-medium text-gray-900">{{ comment.author.username }}</span>
          <span>•</span>
          <time :datetime="comment.createdAt.toISOString()">
            {{ formatRelativeTime(comment.createdAt) }}
          </time>
          <span v-if="comment.updatedAt > comment.createdAt">
            (edited)
          </span>
        </div>

        <!-- Comment Body -->
        <div v-if="!comment.isEditing" class="mb-3">
          <div
            class="markdown-content"
            v-html="renderedContent"
          />
        </div>

        <!-- Edit Mode -->
        <div v-else class="mb-3">
          <CommentEditor
            :post-id="comment.postId"
            :initial-value="comment.content"
            :on-submit="updateComment"
            :on-cancel="cancelEdit"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4 text-sm">
          <button
            @click="vote(1)"
            class="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
          >
            <ChevronUp class="w-4 h-4" />
            <span>{{ comment.votes }}</span>
          </button>

          <button
            @click="vote(-1)"
            class="text-gray-500 hover:text-gray-700"
          >
            <ChevronDown class="w-4 h-4" />
          </button>

          <button
            @click="toggleReply"
            class="text-gray-500 hover:text-gray-700"
          >
            Reply
          </button>

          <button
            v-if="canEdit"
            @click="startEdit"
            class="text-gray-500 hover:text-gray-700"
          >
            Edit
          </button>

          <button
            v-if="canDelete"
            @click="deleteComment"
            class="text-gray-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>

        <!-- Reply Editor -->
        <div v-if="showReplyEditor" class="mt-4">
          <CommentEditor
            :post-id="comment.postId"
            :parent-comment-id="comment.id"
            :on-submit="submitReply"
            :on-cancel="cancelReply"
          />
        </div>

        <!-- Replies -->
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-4">
          <div class="comment-thread">
            <CommentItem
              v-for="reply in comment.replies"
              :key="reply.id"
              :comment="reply"
              :level="level + 1"
              @update="$emit('update')"
              @delete="$emit('delete')"
            />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import type { Comment } from '~/types'
import { renderMarkdown, processMentions, formatRelativeTime } from '~/utils/markdown'

interface Props {
  comment: Comment
  level?: number
  maxLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
  maxLevel: 5
})

const emit = defineEmits<{
  update: []
  delete: []
}>()

// State
const showReplyEditor = ref(false)
const { createComment, updateComment: updateCommentApi, deleteComment: deleteCommentApi } = useComments()

// Computed
const renderedContent = computed(() => {
  const processedContent = processMentions(props.comment.content)
  return renderMarkdown(processedContent)
})

const canEdit = computed(() => {
  // In a real app, check if current user is the comment author
  return true
})

const canDelete = computed(() => {
  // In a real app, check if current user is the comment author or has admin rights
  return true
})

// Methods
const vote = async (direction: 1 | -1) => {
  // In a real app, this would call the vote API
  console.log(`Voting ${direction > 0 ? 'up' : 'down'} on comment ${props.comment.id}`)
}

const toggleReply = () => {
  if (props.level < props.maxLevel) {
    showReplyEditor.value = !showReplyEditor.value
  }
}

const submitReply = async (content: string) => {
  const newComment = await createComment({
    content,
    postId: props.comment.postId,
    parentCommentId: props.comment.id
  })

  if (newComment) {
    showReplyEditor.value = false
    emit('update')
  }
}

const cancelReply = () => {
  showReplyEditor.value = false
}

const startEdit = () => {
  // Set the comment to editing mode
  props.comment.isEditing = true
}

const updateComment = async (content: string) => {
  const updatedComment = await updateCommentApi(props.comment.id, { content })
  
  if (updatedComment) {
    props.comment.isEditing = false
    emit('update')
  }
}

const cancelEdit = () => {
  props.comment.isEditing = false
}

const deleteComment = async () => {
  if (confirm('Are you sure you want to delete this comment?')) {
    const success = await deleteCommentApi(props.comment.id)
    
    if (success) {
      emit('delete')
    }
  }
}
</script>

<style scoped>
.comment {
  @apply py-4;
}

.comment:not(:last-child) {
  @apply border-b border-gray-100;
}
</style>