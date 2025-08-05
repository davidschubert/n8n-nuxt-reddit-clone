<template>
  <div>
    <Head>
      <title>{{ profile.username }}'s Profile - Reddit Clone</title>
      <meta name="description" :content="`Profile page for ${profile.username}`" >
    </Head>

    <div v-if="error" class="card p-8 text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h1>
      <p class="text-gray-600 mb-6">The user "{{ $route.params.username }}" does not exist.</p>
      <NuxtLink to="/" class="btn-primary">
        Go Home
      </NuxtLink>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="card p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <!-- Avatar Section -->
          <div class="flex-shrink-0">
            <div class="relative">
              <img 
                :src="profile.avatar || '/default-avatar.svg'" 
                :alt="`${profile.username}'s avatar`"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              >
              <AvatarUpload 
                v-if="isOwnProfile" 
                class="absolute bottom-0 right-0"
                @upload="handleAvatarUpload"
              />
            </div>
          </div>

          <!-- Profile Info -->
          <div class="flex-grow">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ profile.username }}</h1>
                <p v-if="profile.displayName" class="text-lg text-gray-600">{{ profile.displayName }}</p>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Joined {{ formatDate(profile.createdAt) }}</span>
                  <span>{{ profile.karma || 0 }} karma</span>
                </div>
              </div>
              
              <div v-if="isOwnProfile" class="flex gap-2">
                <button 
                  class="btn-primary"
                  @click="toggleEditMode"
                >
                  {{ editMode ? 'Cancel' : 'Edit Profile' }}
                </button>
              </div>
            </div>

            <div v-if="profile.bio" class="mt-4">
              <p class="text-gray-700">{{ profile.bio }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <EditProfileForm 
        v-if="editMode && isOwnProfile"
        :profile="profile"
        class="mb-6"
        @save="handleProfileSave"
        @cancel="toggleEditMode"
      />

      <!-- Profile Content Tabs -->
      <div class="card">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button 
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6 min-h-[300px]">
          <div v-if="activeTab === 'posts'" class="space-y-4">
            <div v-if="profile.posts && profile.posts.length > 0">
              <div v-for="post in profile.posts" :key="post.id" class="border-b border-gray-100 pb-4 last:border-b-0">
                <h3 class="font-medium text-gray-900">{{ post.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <p>No posts yet.</p>
            </div>
          </div>

          <div v-if="activeTab === 'comments'" class="space-y-4">
            <div v-if="profile.comments && profile.comments.length > 0">
              <div v-for="comment in profile.comments" :key="comment.id" class="border-b border-gray-100 pb-4 last:border-b-0">
                <p class="text-gray-700">{{ comment.content }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ formatDate(comment.createdAt) }}</p>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <p>No comments yet.</p>
            </div>
          </div>

          <div v-if="activeTab === 'about'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Profile Info</h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Username</dt>
                    <dd class="text-sm text-gray-900">{{ profile.username }}</dd>
                  </div>
                  <div v-if="profile.displayName">
                    <dt class="text-sm font-medium text-gray-500">Display Name</dt>
                    <dd class="text-sm text-gray-900">{{ profile.displayName }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Member Since</dt>
                    <dd class="text-sm text-gray-900">{{ formatDate(profile.createdAt) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Karma</dt>
                    <dd class="text-sm text-gray-900">{{ profile.karma || 0 }}</dd>
                  </div>
                </dl>
              </div>
              
              <div v-if="profile.bio">
                <h3 class="font-semibold text-gray-900 mb-2">About</h3>
                <p class="text-sm text-gray-700">{{ profile.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Profile page with dynamic username
const route = useRoute()
const username = route.params.username

// Reactive state
const error = ref(false)
const editMode = ref(false)
const activeTab = ref('posts')
const profile = ref({})

// Computed properties
const isOwnProfile = computed(() => {
  // In a real app, this would check against the current user
  return username === 'testuser'
})

const tabs = [
  { id: 'posts', name: 'Posts' },
  { id: 'comments', name: 'Comments' },
  { id: 'about', name: 'About' }
]

// Methods
const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const handleAvatarUpload = (avatarUrl) => {
  profile.value.avatar = avatarUrl
  // In a real app, this would make an API call to update the avatar
}

const handleProfileSave = (updatedProfile) => {
  profile.value = { ...profile.value, ...updatedProfile }
  editMode.value = false
  // In a real app, this would make an API call to save the profile
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Fetch profile data (SSR)
const fetchProfile = async (username) => {
  try {
    // Mock data for demonstration
    // In a real app, this would be an API call
    const mockProfiles = {
      testuser: {
        username: 'testuser',
        displayName: 'Test User',
        bio: 'This is a test user profile for demonstration purposes.',
        avatar: '/default-avatar.svg',
        createdAt: '2024-01-15T10:30:00Z',
        karma: 1234,
        posts: [
          { id: 1, title: 'My first post', createdAt: '2024-01-20T14:30:00Z' },
          { id: 2, title: 'Another interesting post', createdAt: '2024-01-22T09:15:00Z' }
        ],
        comments: [
          { id: 1, content: 'Great post! Thanks for sharing.', createdAt: '2024-01-21T11:45:00Z' },
          { id: 2, content: 'I completely agree with this.', createdAt: '2024-01-23T16:20:00Z' }
        ]
      },
      johndoe: {
        username: 'johndoe',
        displayName: 'John Doe',
        bio: 'Software developer interested in web technologies.',
        avatar: '/default-avatar.svg',
        createdAt: '2023-12-01T08:00:00Z',
        karma: 567,
        posts: [],
        comments: []
      }
    }

    const userProfile = mockProfiles[username]
    if (!userProfile) {
      throw new Error('User not found')
    }

    return userProfile
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile Not Found'
    })
  }
}

// Server-side data fetching
try {
  const data = await fetchProfile(username)
  profile.value = data
} catch {
  error.value = true
}

// SEO Meta
useSeoMeta({
  title: `${profile.value?.username || username}'s Profile - Reddit Clone`,
  description: `Profile page for ${profile.value?.username || username}`,
  ogTitle: `${profile.value?.username || username}'s Profile`,
  ogDescription: profile.value?.bio || `Profile page for ${profile.value?.username || username}`,
  ogImage: profile.value?.avatar || '/default-avatar.svg'
})
</script>

<style scoped>
/* Profile-specific styles */
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>