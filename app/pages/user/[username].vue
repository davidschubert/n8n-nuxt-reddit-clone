<template>
  <div class="profile-page">
    <div class="container">
      <div v-if="pending" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading user profile...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <h1>User Not Found</h1>
        <p>The user "{{ $route.params.username }}" could not be found.</p>
        <NuxtLink to="/" class="home-link">← Back to Home</NuxtLink>
      </div>
      
      <div v-else-if="user" class="profile-content">
        <ProfileUserInfo :user="user" />
        
        <ProfileActivityFeed 
          :activities="activities"
          :loading="activitiesLoading"
          :has-more="hasMoreActivities"
          :loading-more="loadingMoreActivities"
          @load-more="loadMoreActivities"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile, Activity } from '~/types/user'

// Set page metadata
const route = useRoute()
const username = route.params.username as string

useHead({
  title: `${username} - User Profile`,
  meta: [
    { name: 'description', content: `View ${username}'s profile, posts, and activity on our Reddit clone.` }
  ]
})

// Composables
const { getUserProfile, getUserActivities } = useUserData()

// State
const user = ref<UserProfile | null>(null)
const activities = ref<Activity[]>([])
const activitiesPage = ref(1)
const activitiesLoading = ref(false)
const loadingMoreActivities = ref(false)
const hasMoreActivities = ref(false)
const pending = ref(true)
const error = ref(false)

// Load initial data
onMounted(async () => {
  await Promise.all([
    loadUserProfile(),
    loadInitialActivities()
  ])
  pending.value = false
})

const loadUserProfile = async () => {
  try {
    const userData = await getUserProfile(username)
    if (userData) {
      user.value = userData
    } else {
      error.value = true
    }
  } catch (e) {
    console.error('Error loading user profile:', e)
    error.value = true
  }
}

const loadInitialActivities = async () => {
  if (!username) return
  
  try {
    activitiesLoading.value = true
    const result = await getUserActivities(username, 1, 5)
    activities.value = result.activities
    hasMoreActivities.value = result.hasMore
  } catch (e) {
    console.error('Error loading activities:', e)
  } finally {
    activitiesLoading.value = false
  }
}

const loadMoreActivities = async () => {
  if (loadingMoreActivities.value || !hasMoreActivities.value) return
  
  try {
    loadingMoreActivities.value = true
    activitiesPage.value++
    
    const result = await getUserActivities(username, activitiesPage.value, 5)
    activities.value.push(...result.activities)
    hasMoreActivities.value = result.hasMore
  } catch (e) {
    console.error('Error loading more activities:', e)
    activitiesPage.value-- // Revert page increment on error
  } finally {
    loadingMoreActivities.value = false
  }
}

// Watch for route changes (if user navigates to different profile)
watch(() => route.params.username, async (newUsername) => {
  if (newUsername && newUsername !== username) {
    pending.value = true
    error.value = false
    activities.value = []
    activitiesPage.value = 1
    
    await Promise.all([
      loadUserProfile(),
      loadInitialActivities()
    ])
    
    pending.value = false
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p,
.error-state p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.error-state h1 {
  color: #1f2937;
  font-size: 24px;
  margin: 0 0 12px 0;
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.home-link:hover {
  color: #2563eb;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Responsive design */
@media (max-width: 768px) {
  .profile-page {
    padding: 16px 0;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .profile-content {
    gap: 16px;
  }
}
</style>