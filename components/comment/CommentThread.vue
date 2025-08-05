<template>
  <div 
    class="comment-thread"
    role="region"
    :aria-label="`Comments for post ${postId}`"
  >
    <!-- Thread header -->
    <div class="thread-header">
      <h3 class="thread-title">
        Comments ({{ totalComments }})
      </h3>
      
      <div class="thread-controls">
        <button
          @click="toggleSort"
          class="sort-button"
          :aria-label="`Sort by ${sortBy === 'newest' ? 'oldest' : 'newest'} first`"
          type="button"
        >
          Sort: {{ sortBy === 'newest' ? 'Newest' : 'Oldest' }}
        </button>
        
        <button
          v-if="hasCollapsedComments"
          @click="expandAll"
          class="expand-button"
          aria-label="Expand all collapsed comments"
          type="button"
        >
          Expand All
        </button>
      </div>
    </div>

    <!-- New comment form -->
    <div class="new-comment-section">
      <h4 class="new-comment-title">Add a comment</h4>
      <ReplyForm
        :isVisible="true"
        @submit="handleNewComment"
        @cancel="() => {}"
      />
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state" role="status" aria-live="polite">
      <div class="loading-spinner-large"></div>
      <span>Loading comments...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state" role="alert">
      <p>{{ error }}</p>
      <button @click="retryLoading" class="retry-button" type="button">
        Try Again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="sortedComments.length === 0" class="empty-state">
      <p>No comments yet. Be the first to comment!</p>
    </div>

    <!-- Comments list -->
    <div v-else class="comments-list">
      <CommentComponent
        v-for="comment in paginatedComments"
        :key="comment.id"
        :comment="comment"
        :depth="0"
        :maxDepth="maxDepth"
        :showReplies="true"
        @reply-submitted="handleReplySubmit"
        @comment-liked="handleCommentLike"
      />
      
      <!-- Load more button -->
      <div v-if="hasMoreComments" class="load-more-section">
        <button
          @click="loadMoreComments"
          class="load-more-button"
          :disabled="isLoadingMore"
          :aria-label="isLoadingMore ? 'Loading more comments' : 'Load more comments'"
          type="button"
        >
          <span v-if="isLoadingMore" class="loading-spinner"></span>
          {{ isLoadingMore ? 'Loading...' : `Load More (${remainingComments} remaining)` }}
        </button>
      </div>
    </div>

    <!-- Performance info (development only) -->
    <div v-if="showPerformanceInfo" class="performance-info">
      <small>
        Showing {{ paginatedComments.length }} of {{ totalComments }} comments
        (Page {{ currentPage }})
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThreadProps, Comment } from '~/types/comment'

interface Props extends ThreadProps {}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 10
})

const emit = defineEmits<{
  'comment-added': [comment: Comment]
  'comment-updated': [comment: Comment]
}>()

// Reactive state
const sortBy = ref<'newest' | 'oldest'>('newest')
const isLoading = ref(false)
const isLoadingMore = ref(false)
const error = ref('')
const currentPage = ref(1)
const commentsPerPage = 10

// Computed properties
const sortedComments = computed(() => {
  const sorted = [...props.comments].sort((a, b) => {
    const aTime = a.timestamp.getTime()
    const bTime = b.timestamp.getTime()
    return sortBy.value === 'newest' ? bTime - aTime : aTime - bTime
  })
  return sorted
})

const paginatedComments = computed(() => {
  const endIndex = currentPage.value * commentsPerPage
  return sortedComments.value.slice(0, endIndex)
})

const hasMoreComments = computed(() => {
  return paginatedComments.value.length < sortedComments.value.length
})

const remainingComments = computed(() => {
  return sortedComments.value.length - paginatedComments.value.length
})

const totalComments = computed(() => {
  const countReplies = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + countReplies(comment.replies)
    }, 0)
  }
  return countReplies(props.comments)
})

const hasCollapsedComments = computed(() => {
  const hasCollapsed = (comments: Comment[]): boolean => {
    return comments.some(comment => 
      comment.isCollapsed || hasCollapsed(comment.replies)
    )
  }
  return hasCollapsed(props.comments)
})

const showPerformanceInfo = computed(() => {
  // Show in development mode
  return process.dev && totalComments.value > 20
})

// Methods
const toggleSort = () => {
  sortBy.value = sortBy.value === 'newest' ? 'oldest' : 'newest'
}

const expandAll = () => {
  const expandComments = (comments: Comment[]) => {
    comments.forEach(comment => {
      comment.isCollapsed = false
      expandComments(comment.replies)
    })
  }
  expandComments(props.comments)
}

const loadMoreComments = async () => {
  isLoadingMore.value = true
  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    currentPage.value++
  } catch (err) {
    error.value = 'Failed to load more comments'
  } finally {
    isLoadingMore.value = false
  }
}

const retryLoading = async () => {
  error.value = ''
  isLoading.value = true
  try {
    // Simulate retry
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = 'Failed to load comments. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleNewComment = (content: string) => {
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    content,
    author: 'Current User', // Would come from auth context
    timestamp: new Date(),
    replies: [],
    depth: 0,
    likes: 0,
    isLiked: false
  }
  
  emit('comment-added', newComment)
}

const handleReplySubmit = ({ parentId, content }: { parentId: string, content: string }) => {
  const addReply = (comments: Comment[], targetId: string, reply: Comment): boolean => {
    for (const comment of comments) {
      if (comment.id === targetId) {
        reply.depth = comment.depth + 1
        comment.replies.push(reply)
        return true
      }
      if (addReply(comment.replies, targetId, reply)) {
        return true
      }
    }
    return false
  }

  const newReply: Comment = {
    id: `reply-${Date.now()}`,
    content,
    author: 'Current User',
    timestamp: new Date(),
    parentId,
    replies: [],
    depth: 0, // Will be set by addReply
    likes: 0,
    isLiked: false
  }

  addReply(props.comments, parentId, newReply)
  emit('comment-updated', newReply)
}

const handleCommentLike = ({ commentId, isLiked }: { commentId: string, isLiked: boolean }) => {
  const updateLike = (comments: Comment[], targetId: string): boolean => {
    for (const comment of comments) {
      if (comment.id === targetId) {
        return true
      }
      if (updateLike(comment.replies, targetId)) {
        return true
      }
    }
    return false
  }

  updateLike(props.comments, commentId)
}

// Keyboard navigation
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    // Implement keyboard navigation between comments
    event.preventDefault()
    // Focus management logic would go here
  }
}

// Mount lifecycle
onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
.comment-thread {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.thread-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.thread-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.thread-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.sort-button,
.expand-button {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s ease;
}

.sort-button:hover,
.expand-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.new-comment-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.new-comment-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.loading-spinner-large {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
}

.retry-button {
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #b91c1c;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.comments-list {
  space-y: 1rem;
}

.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.load-more-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.load-more-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.load-more-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.performance-info {
  margin-top: 1rem;
  text-align: center;
  color: #6b7280;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .comment-thread {
    padding: 0.75rem;
  }
  
  .thread-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .thread-controls {
    justify-content: center;
  }
  
  .new-comment-section {
    padding: 1rem;
  }
  
  .thread-title {
    text-align: center;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .thread-header {
    border-bottom-color: #000000;
  }
  
  .new-comment-section {
    border-color: #000000;
  }
  
  .load-more-section {
    border-top-color: #000000;
  }
}

/* Focus management */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>