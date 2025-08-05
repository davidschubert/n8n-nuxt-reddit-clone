<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Profile Header -->
    <div class="card p-8 mb-8">
      <div class="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <img 
            :src="userProfile.prefs?.avatar || 'https://via.placeholder.com/120'" 
            :alt="`${userProfile.name} Avatar`" 
            class="w-32 h-32 avatar object-cover"
          >
        </div>
        
        <!-- User Info -->
        <div class="flex-1">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ userProfile.name }}
              </h1>
              <p class="text-gray-600 text-lg mt-1">
                u/{{ userProfile.name }}
              </p>
            </div>
            
            <div v-if="isOwnProfile" class="mt-4 sm:mt-0">
              <button 
                @click="showEditModal = true"
                class="btn-secondary"
              >
                Profil bearbeiten
              </button>
            </div>
          </div>
          
          <!-- Bio -->
          <div v-if="userProfile.prefs?.bio" class="mt-6">
            <p class="text-gray-700 leading-relaxed">
              {{ userProfile.prefs.bio }}
            </p>
          </div>
          
          <!-- User Stats -->
          <div class="flex flex-wrap gap-8 mt-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">
                {{ userProfile.prefs?.karma || 0 }}
              </div>
              <div class="text-sm text-gray-600">Karma</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">
                {{ formatDate(userProfile.prefs?.cakeDay) }}
              </div>
              <div class="text-sm text-gray-600">Mitglied seit</div>
            </div>
            
            <div v-if="userProfile.prefs?.location" class="text-center">
              <div class="text-sm text-gray-900 font-medium">
                📍 {{ userProfile.prefs.location }}
              </div>
              <div class="text-sm text-gray-600">Standort</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content Tabs -->
    <div class="mb-8">
      <nav class="flex space-x-8 border-b border-gray-200">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- Posts Tab -->
      <div v-show="activeTab === 'posts'">
        <div v-if="userPosts.length === 0" class="card p-8 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Keine Beiträge</h3>
          <p class="text-gray-600">
            {{ isOwnProfile ? 'Sie haben noch keine Beiträge erstellt.' : 'Dieser Nutzer hat noch keine Beiträge erstellt.' }}
          </p>
          <div v-if="isOwnProfile" class="mt-4">
            <NuxtLink to="/submit" class="btn-primary">
              Ersten Beitrag erstellen
            </NuxtLink>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <article 
            v-for="post in userPosts" 
            :key="post.id" 
            class="card p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2">
              {{ post.title }}
            </h3>
            <p class="text-gray-600 line-clamp-2 mb-3">
              {{ post.content }}
            </p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>{{ formatTimeAgo(post.createdAt) }}</span>
              <span>{{ post.upvotes }} Upvotes</span>
              <span>{{ post.comments }} Kommentare</span>
            </div>
          </article>
        </div>
      </div>

      <!-- Comments Tab -->
      <div v-show="activeTab === 'comments'">
        <div v-if="userComments.length === 0" class="card p-8 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Keine Kommentare</h3>
          <p class="text-gray-600">
            {{ isOwnProfile ? 'Sie haben noch keine Kommentare geschrieben.' : 'Dieser Nutzer hat noch keine Kommentare geschrieben.' }}
          </p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="comment in userComments" 
            :key="comment.id" 
            class="card p-6"
          >
            <div class="text-sm text-gray-500 mb-2">
              Kommentar zu: <span class="font-medium text-gray-700">{{ comment.postTitle }}</span>
            </div>
            <p class="text-gray-900 mb-3">
              {{ comment.content }}
            </p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>{{ formatTimeAgo(comment.createdAt) }}</span>
              <span>{{ comment.upvotes }} Upvotes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- About Tab -->
      <div v-show="activeTab === 'about'">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Über {{ userProfile.name }}</h3>
          
          <div class="space-y-6">
            <div v-if="userProfile.prefs?.bio">
              <h4 class="font-medium text-gray-900 mb-2">Biografie</h4>
              <p class="text-gray-700 leading-relaxed">
                {{ userProfile.prefs.bio }}
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Statistiken</h4>
                <dl class="space-y-2">
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Karma:</dt>
                    <dd class="font-medium">{{ userProfile.prefs?.karma || 0 }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Beiträge:</dt>
                    <dd class="font-medium">{{ userPosts.length }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Kommentare:</dt>
                    <dd class="font-medium">{{ userComments.length }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Mitglied seit:</dt>
                    <dd class="font-medium">{{ formatDate(userProfile.prefs?.cakeDay) }}</dd>
                  </div>
                </dl>
              </div>
              
              <div v-if="userProfile.prefs?.location">
                <h4 class="font-medium text-gray-900 mb-3">Standort</h4>
                <p class="text-gray-700">{{ userProfile.prefs.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showEditModal = false"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Profil bearbeiten</h3>
            
            <form @submit.prevent="updateProfile">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Biografie</label>
                  <textarea 
                    v-model="editForm.bio"
                    rows="4" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Erzählen Sie uns etwas über sich..."
                  ></textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Standort</label>
                  <input 
                    v-model="editForm.location"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Berlin, Deutschland"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                  <input 
                    v-model="editForm.avatar"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  >
                </div>
              </div>
              
              <div class="mt-6 flex justify-end space-x-3">
                <button 
                  type="button"
                  @click="showEditModal = false"
                  class="btn-secondary"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit"
                  class="btn-primary"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, getCurrentUser } = useAuth()

// Get username from route params
const username = computed(() => route.params.username as string)

// State
const activeTab = ref('posts')
const showEditModal = ref(false)
const userProfile = ref({})
const userPosts = ref([])
const userComments = ref([])

// Edit form
const editForm = ref({
  bio: '',
  location: '',
  avatar: ''
})

// Computed
const isOwnProfile = computed(() => {
  return user.value && (user.value.name === username.value || user.value.$id === username.value)
})

// Tabs configuration
const tabs = [
  { id: 'posts', name: 'Beiträge' },
  { id: 'comments', name: 'Kommentare' },
  { id: 'about', name: 'Über' }
]

// Mock data for development
const mockPosts = [
  {
    id: '1',
    title: 'Mein erster Beitrag auf Reddit Clone',
    content: 'Hallo Community! Ich freue mich, Teil dieser Plattform zu sein und bin gespannt auf interessante Diskussionen.',
    upvotes: 15,
    comments: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '2',
    title: 'Vue.js vs React - Meine Erfahrungen',
    content: 'Nach mehreren Jahren mit beiden Frameworks möchte ich meine Erfahrungen teilen...',
    upvotes: 42,
    comments: 23,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
  }
]

const mockComments = [
  {
    id: '1',
    postTitle: 'Beste Practices für Nuxt.js',
    content: 'Großartiger Artikel! Besonders der Teil über SSR hat mir sehr geholfen.',
    upvotes: 8,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  }
]

// Methods
const loadUserProfile = async () => {
  try {
    // In a real app, fetch user data from Appwrite
    // For now, use mock data or current user data
    if (isOwnProfile.value && user.value) {
      userProfile.value = user.value
      userPosts.value = mockPosts
      userComments.value = mockComments
    } else {
      // Mock user profile for non-current users
      userProfile.value = {
        $id: `user-${username.value}`,
        name: username.value,
        email: `${username.value}@example.com`,
        prefs: {
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          bio: 'Enthusiastischer Entwickler mit Leidenschaft für moderne Webtechnologien.',
          karma: 856,
          cakeDay: '2023-03-10',
          location: 'München, Deutschland'
        }
      }
      userPosts.value = []
      userComments.value = []
    }
    
    // Initialize edit form
    editForm.value = {
      bio: userProfile.value.prefs?.bio || '',
      location: userProfile.value.prefs?.location || '',
      avatar: userProfile.value.prefs?.avatar || ''
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

const updateProfile = async () => {
  try {
    // In a real app, update user profile in Appwrite
    console.log('Updating profile:', editForm.value)
    
    // Update local state
    if (userProfile.value.prefs) {
      userProfile.value.prefs.bio = editForm.value.bio
      userProfile.value.prefs.location = editForm.value.location
      userProfile.value.prefs.avatar = editForm.value.avatar
    }
    
    showEditModal.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Unbekannt'
  return new Date(dateString).toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long' 
  })
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'vor wenigen Sekunden'
  if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Minuten`
  if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Stunden`
  if (diffInSeconds < 604800) return `vor ${Math.floor(diffInSeconds / 86400)} Tagen`
  
  return date.toLocaleDateString('de-DE')
}

// Lifecycle
onMounted(async () => {
  await getCurrentUser()
  await loadUserProfile()
})

// Watch for route changes
watch(() => route.params.username, async () => {
  await loadUserProfile()
})

// SEO
useHead({
  title: () => `${userProfile.value.name || username.value} - Profil`,
  meta: [
    { 
      name: 'description', 
      content: () => `Profil von ${userProfile.value.name || username.value} auf Reddit Clone`
    }
  ]
})
</script>