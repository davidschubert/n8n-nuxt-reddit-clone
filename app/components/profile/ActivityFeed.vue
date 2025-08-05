<template>
  <div class="activity-feed">
    <h2 class="feed-title">Recent Activity</h2>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading activities...</p>
    </div>
    
    <div v-else-if="activities.length === 0" class="empty-state">
      <p>No recent activity found.</p>
    </div>
    
    <div v-else class="activity-list">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="activity-item"
        :class="`activity-${activity.type}`"
      >
        <div class="activity-header">
          <div class="activity-type">
            <span class="type-icon">
              {{ activity.type === 'post' ? '📝' : '💬' }}
            </span>
            <span class="type-text">
              {{ activity.type === 'post' ? 'Post' : 'Comment' }}
            </span>
            <span v-if="activity.subreddit" class="subreddit">
              in r/{{ activity.subreddit }}
            </span>
          </div>
          <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
        </div>
        
        <h3 class="activity-title">{{ activity.title }}</h3>
        
        <div class="activity-content">
          <p>{{ truncateContent(activity.content) }}</p>
        </div>
        
        <div class="activity-stats">
          <span class="stat upvotes">
            ↑ {{ activity.upvotes }}
          </span>
          <span class="stat downvotes">
            ↓ {{ activity.downvotes }}
          </span>
          <span class="stat karma">
            {{ activity.upvotes - activity.downvotes }} karma
          </span>
        </div>
      </div>
    </div>
    
    <div v-if="hasMore && !loading" class="load-more">
      <button @click="loadMore" class="load-more-btn" :disabled="loadingMore">
        {{ loadingMore ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '~/types/user'

interface Props {
  activities: Activity[]
  loading?: boolean
  hasMore?: boolean
  loadingMore?: boolean
}

interface Emits {
  loadMore: []
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false,
  loadingMore: false
})

const emit = defineEmits<Emits>()

const loadMore = () => {
  emit('loadMore')
}

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(timestamp).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

const truncateContent = (content: string, maxLength: number = 200) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.activity-feed {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.feed-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.activity-post {
  border-left: 4px solid #3b82f6;
}

.activity-comment {
  border-left: 4px solid #10b981;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.activity-type {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.type-icon {
  font-size: 16px;
}

.subreddit {
  color: #3b82f6;
  font-weight: 500;
}

.activity-time {
  color: #9ca3af;
  font-size: 12px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.activity-content {
  margin-bottom: 12px;
}

.activity-content p {
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

.activity-stats {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 14px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.upvotes {
  color: #059669;
}

.downvotes {
  color: #dc2626;
}

.karma {
  color: #6b7280;
  font-weight: 500;
}

.load-more {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.load-more-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #2563eb;
}

.load-more-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .activity-feed {
    padding: 16px;
  }
  
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .activity-stats {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .feed-title {
    font-size: 18px;
  }
}
</style>