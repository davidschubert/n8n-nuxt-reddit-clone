<template>
  <div class="user-info-card">
    <div class="user-header">
      <img 
        :src="user.avatar" 
        :alt="`${user.username}'s avatar`"
        class="user-avatar"
      >
      <div class="user-details">
        <h1 class="username">{{ user.username }}</h1>
        <p class="join-date">
          Member since {{ formatDate(user.joinDate) }}
        </p>
      </div>
    </div>
    
    <div class="user-bio" v-if="user.bio">
      <p>{{ user.bio }}</p>
    </div>
    
    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-value">{{ user.karma.toLocaleString() }}</span>
        <span class="stat-label">Karma</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ user.postCount }}</span>
        <span class="stat-label">Posts</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ user.commentCount }}</span>
        <span class="stat-label">Comments</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types/user'

interface Props {
  user: UserProfile
}

defineProps<Props>()

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('de-DE', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}
</script>

<style scoped>
.user-info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f3f4f6;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.join-date {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.user-bio {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.user-bio p {
  margin: 0;
  color: #374151;
  line-height: 1.5;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive design */
@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
  }
  
  .user-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .stat-item:last-child {
    border-bottom: none;
  }
  
  .stat-value {
    font-size: 18px;
    margin-bottom: 0;
  }
}
</style>