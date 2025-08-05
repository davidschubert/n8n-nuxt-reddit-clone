<template>
  <div 
    :class="[
      'comment-item',
      `comment-depth-${depth}`,
      { 'comment-collapsed': comment.isCollapsed }
    ]"
    :style="{ marginLeft: depth > 0 ? `${depth * 20}px` : '0' }"
    role="article"
    :aria-label="`Comment by ${comment.author} at depth ${depth}`"
  >
    <!-- Thread depth indicator -->
    <div class="comment-thread-indicator" v-if="depth > 0">
      <div 
        v-for="i in depth" 
        :key="i" 
        class="thread-line"
        :class="{ 'thread-line-last': i === depth }"
      ></div>
    </div>

    <!-- Comment content -->
    <div class="comment-content">
      <!-- Comment header -->
      <div class="comment-header">
        <span class="comment-author">{{ comment.author }}</span>
        <span class="comment-timestamp">{{ formatTimestamp(comment.timestamp) }}</span>
        <button 
          v-if="comment.replies.length > 0"
          @click="toggleCollapse"
          class="collapse-button"
          :aria-label="comment.isCollapsed ? 'Expand replies' : 'Collapse replies'"
          type="button"
        >
          {{ comment.isCollapsed ? `[+] ${comment.replies.length} replies` : '[-]' }}
        </button>
      </div>

      <!-- Comment text -->
      <div class="comment-text" v-if="!comment.isCollapsed">
        {{ comment.content }}
      </div>

      <!-- Comment actions -->
      <div class="comment-actions" v-if="!comment.isCollapsed">
        <button 
          @click="toggleLike"
          class="like-button"
          :class="{ 'liked': comment.isLiked }"
          :aria-label="`${comment.isLiked ? 'Unlike' : 'Like'} comment`"
          type="button"
        >
          ↑ {{ comment.likes }}
        </button>
        
        <button 
          v-if="depth < (maxDepth || 10)"
          @click="showReplyForm = !showReplyForm"
          class="reply-button"
          :aria-label="showReplyForm ? 'Cancel reply' : 'Reply to comment'"
          type="button"
        >
          {{ showReplyForm ? 'Cancel' : 'Reply' }}
        </button>
      </div>

      <!-- Reply form -->
      <ReplyForm
        v-if="showReplyForm && !comment.isCollapsed"
        :parentId="comment.id"
        :isVisible="showReplyForm"
        @submit="handleReplySubmit"
        @cancel="showReplyForm = false"
      />

      <!-- Loading state for replies -->
      <div v-if="isLoadingReplies" class="loading-replies">
        Loading replies...
      </div>
    </div>

    <!-- Nested replies -->
    <div 
      v-if="showReplies && !comment.isCollapsed && comment.replies.length > 0"
      class="comment-replies"
      role="group"
      :aria-label="`Replies to ${comment.author}'s comment`"
    >
      <CommentComponent
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="depth + 1"
        :maxDepth="maxDepth"
        :showReplies="showReplies"
        @reply-submitted="$emit('reply-submitted', $event)"
        @comment-liked="$emit('comment-liked', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentProps } from '~/types/comment'

interface Props extends CommentProps {}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 10,
  showReplies: true
})

const emit = defineEmits<{
  'reply-submitted': [{ parentId: string, content: string }]
  'comment-liked': [{ commentId: string, isLiked: boolean }]
}>()

const showReplyForm = ref(false)
const isLoadingReplies = ref(false)

// Format timestamp for display
const formatTimestamp = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

// Toggle comment collapse state
const toggleCollapse = () => {
  props.comment.isCollapsed = !props.comment.isCollapsed
}

// Toggle like state
const toggleLike = () => {
  const wasLiked = props.comment.isLiked
  props.comment.isLiked = !wasLiked
  props.comment.likes += wasLiked ? -1 : 1
  
  emit('comment-liked', {
    commentId: props.comment.id,
    isLiked: props.comment.isLiked
  })
}

// Handle reply submission
const handleReplySubmit = (content: string) => {
  emit('reply-submitted', {
    parentId: props.comment.id,
    content
  })
  showReplyForm.value = false
}

// Keyboard navigation support
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    if (event.target === event.currentTarget) {
      event.preventDefault()
      // Focus first actionable element
      const firstButton = (event.currentTarget as HTMLElement).querySelector('button')
      firstButton?.focus()
    }
  }
}
</script>

<style scoped>
.comment-item {
  position: relative;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.comment-thread-indicator {
  position: absolute;
  left: -20px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: stretch;
}

.thread-line {
  width: 2px;
  background-color: #e5e7eb;
  margin-right: 18px;
  position: relative;
}

.thread-line-last::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -9px;
  width: 18px;
  height: 2px;
  background-color: #e5e7eb;
}

.comment-content {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.comment-author {
  font-weight: 600;
  color: #1f2937;
}

.comment-timestamp {
  color: #6b7280;
  font-size: 0.875rem;
}

.collapse-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: auto;
}

.collapse-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.comment-text {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  white-space: pre-wrap;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.like-button,
.reply-button {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.like-button:hover,
.reply-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.like-button.liked {
  color: #dc2626;
  border-color: #dc2626;
  background-color: #fef2f2;
}

.comment-replies {
  margin-top: 1rem;
}

.comment-collapsed .comment-content {
  opacity: 0.6;
}

.loading-replies {
  color: #6b7280;
  font-style: italic;
  padding: 0.5rem 0;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .comment-item {
    margin-left: 0 !important;
  }
  
  .comment-thread-indicator {
    left: -10px;
  }
  
  .thread-line {
    margin-right: 8px;
  }
  
  .thread-line-last::after {
    right: -4px;
    width: 8px;
  }
  
  .comment-content {
    padding: 0.75rem;
  }
  
  .comment-header {
    font-size: 0.875rem;
  }
  
  .comment-actions {
    flex-wrap: wrap;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .comment-content {
    border-color: #000000;
  }
  
  .thread-line,
  .thread-line-last::after {
    background-color: #000000;
  }
  
  .comment-text {
    color: #000000;
  }
}

/* Focus management for accessibility */
.comment-item:focus-within .comment-content {
  box-shadow: 0 0 0 2px #3b82f6;
  outline: none;
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>