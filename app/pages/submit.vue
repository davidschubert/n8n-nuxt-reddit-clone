<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="card p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Beitrag erstellen</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Titel
          </label>
          <input 
            v-model="form.title"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ein interessanter Titel für Ihren Beitrag..."
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Inhalt
          </label>
          <textarea 
            v-model="form.content"
            rows="12" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Teilen Sie Ihre Gedanken, Erfahrungen oder Fragen..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <NuxtLink to="/" class="btn-secondary">
            Abbrechen
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="btn-primary disabled:opacity-50"
          >
            {{ isLoading ? 'Veröffentlichen...' : 'Veröffentlichen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn } = useAuth()
const router = useRouter()

const form = ref({
  title: '',
  content: ''
})

const isLoading = ref(false)

const handleSubmit = async () => {
  if (!isLoggedIn.value) {
    await router.push('/login')
    return
  }

  isLoading.value = true
  try {
    // In a real app, save to Appwrite
    console.log('Creating post:', form.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await router.push('/')
  } catch (error) {
    console.error('Error creating post:', error)
  } finally {
    isLoading.value = false
  }
}

// Redirect if not logged in
onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login')
  }
})

// SEO
useHead({
  title: 'Beitrag erstellen - Reddit Clone',
  meta: [
    { name: 'description', content: 'Erstellen Sie einen neuen Beitrag in der Reddit Clone Community' }
  ]
})
</script>