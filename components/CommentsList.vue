<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3>Comments ({{ totalComments }})</h3>
      <div class="sort-options">
        <select v-model="sortBy" @change="refreshComments">
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
          <option value="top">Top Rated</option>
        </select>
      </div>
    </div>
    
    <!-- Add new comment form -->
    <div class="new-comment">
      <CommentForm 
        :post-id="postId"
        @submitted="handleNewComment"
      />
    </div>
    
    <!-- Loading state -->
    <div v-if="loading && !comments.length" class="loading">
      <div class="loading-spinner">Loading comments...</div>
    </div>
    
    <!-- Error state -->
    <div v-if="error && !comments.length" class="error">
      <p>{{ error }}</p>
      <button @click="refreshComments" class="btn btn-secondary">
        Try Again
      </button>
    </div>
    
    <!-- Comments list -->
    <div v-if="comments.length > 0" class="comments-list">
      <CommentItem 
        v-for="comment in comments"
        :key="comment.$id"
        :comment="comment"
        :max-depth="maxDepth"
      />
    </div>
    
    <!-- Empty state -->
    <div v-if="!loading && !error && comments.length === 0" class="empty-state">
      <p>No comments yet. Be the first to comment!</p>
    </div>
    
    <!-- Load more button -->
    <div v-if="hasMore && comments.length > 0" class="load-more">
      <button 
        @click="loadMoreComments"
        :disabled="loading"
        class="btn btn-secondary"
      >
        {{ loading ? 'Loading...' : 'Load More Comments' }}
      </button>
    </div>
    
    <!-- Performance metrics (development only) -->
    <div v-if="showMetrics && isDevelopment" class="performance-metrics">
      <details>
        <summary>Performance Metrics</summary>
        <ul>
          <li>Comments loaded: {{ comments.length }}</li>
          <li>Load time: {{ loadTime }}ms</li>
          <li>Cache hit: {{ cacheHit ? 'Yes' : 'No' }}</li>
          <li>Max depth: {{ maxDepth }}</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'
import { useCommentsStore } from '~/stores/comments'

interface Props {
  postId: string
  maxDepth?: number
  initialComments?: Comment[]
  showMetrics?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 5,
  showMetrics: false
})

const commentsStore = useCommentsStore()
const sortBy = ref('new')
const loadTime = ref(0)
const cacheHit = ref(false)

// Reactive state
const comments = computed(() => commentsStore.getCommentsByPostId(props.postId))
const loading = computed(() => commentsStore.isLoading)
const error = computed(() => commentsStore.error)
const hasMore = ref(false) // TODO: Implement pagination
const totalComments = computed(() => {
  const countReplies = (commentList: Comment[]): number => {
    return commentList.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countReplies(comment.replies) : 0)
    }, 0)
  }
  return countReplies(comments.value)
})

// Initialize comments on mount
onMounted(async () => {
  if (props.initialComments && props.initialComments.length > 0) {
    // Use SSR data if available
    commentsStore.comments[props.postId] = props.initialComments
    cacheHit.value = true
  } else {
    // Fetch comments client-side
    await fetchComments()
  }
})

// Methods
const fetchComments = async (useCache = true) => {
  const startTime = Date.now()
  
  try {
    await commentsStore.fetchComments({
      postId: props.postId,
      limit: 50,
      depth: props.maxDepth
    }, useCache)
    
    loadTime.value = Date.now() - startTime
  } catch (err) {
    console.error('Failed to fetch comments:', err)
  }
}

const refreshComments = async () => {
  commentsStore.clearCache(props.postId)
  await fetchComments(false)
}

const handleNewComment = () => {
  // Comment was added optimistically, no need to refresh
}

const loadMoreComments = async () => {
  // TODO: Implement pagination
  console.log('Load more comments')
}

// Watch for sort changes
watch(sortBy, () => {
  refreshComments()
})

// Provide SEO meta data
useHead({
  meta: [
    {
      name: 'description',
      content: `Discussion with ${totalComments.value} comments`
    }
  ]
})
</script>

<style scoped>
.comments-section {
  margin-top: 24px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.comments-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sort-options select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.new-comment {
  margin-bottom: 24px;
}

.comments-list {
  space-y: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #878a8c;
}

.load-more {
  margin-top: 24px;
  text-align: center;
}

.loading-spinner {
  text-align: center;
  padding: 40px 20px;
  color: #878a8c;
}

.performance-metrics {
  margin-top: 24px;
  padding: 12px;
  background: #f6f7f8;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.performance-metrics summary {
  cursor: pointer;
  font-weight: 600;
}

.performance-metrics ul {
  margin-top: 8px;
  padding-left: 20px;
}

.performance-metrics li {
  margin-bottom: 4px;
}
</style>