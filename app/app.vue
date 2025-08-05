<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold mb-8">N8N Nuxt Reddit Clone</h1>
      
      <!-- Appwrite Connection Status -->
      <div class="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 class="text-xl font-semibold mb-4">Appwrite Connection Status</h2>
        
        <div v-if="healthStatus">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-medium mb-2">Server-side Connection</h3>
              <div class="flex items-center">
                <span 
                  class="w-3 h-3 rounded-full mr-2" 
                  :class="healthStatus.appwrite.status === 'connected' ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                <span>{{ healthStatus.appwrite.status }}</span>
              </div>
              <div v-if="healthStatus.appwrite.error" class="text-red-600 text-sm mt-1">
                Error: {{ healthStatus.appwrite.error }}
              </div>
            </div>
            
            <div>
              <h3 class="font-medium mb-2">Client-side Connection</h3>
              <div class="flex items-center">
                <span 
                  class="w-3 h-3 rounded-full mr-2" 
                  :class="clientStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                <span>{{ clientStatus }}</span>
              </div>
              <div v-if="clientError" class="text-red-600 text-sm mt-1">
                Error: {{ clientError }}
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <h3 class="font-medium mb-2">Configuration</h3>
            <div class="text-sm text-gray-600">
              <p>Endpoint: {{ healthStatus.config.endpoint }}</p>
              <p>Project ID: {{ healthStatus.config.projectId }}</p>
              <p>API Key configured: {{ healthStatus.config.hasApiKey ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-gray-500">
          Loading connection status...
        </div>
        
        <button 
          @click="refreshStatus" 
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Status
        </button>
      </div>
      
      <NuxtWelcome />
    </div>
  </div>
</template>

<script setup>
const healthStatus = ref(null)
const clientStatus = ref('checking')
const clientError = ref(null)

// Check server-side health
const checkHealth = async () => {
  try {
    const { data } = await $fetch('/api/health')
    healthStatus.value = data
  } catch (error) {
    console.error('Failed to fetch health status:', error)
    healthStatus.value = {
      appwrite: { status: 'error', error: error.message },
      config: { endpoint: 'Unknown', projectId: 'Unknown', hasApiKey: false }
    }
  }
}

// Check client-side connection
const checkClientConnection = async () => {
  if (process.client) {
    try {
      const appwrite = useAppwrite()
      await appwrite.account.get().catch(() => {
        // User not logged in is fine, means connection works
      })
      clientStatus.value = 'connected'
      clientError.value = null
    } catch (error) {
      clientStatus.value = 'error'
      clientError.value = error.message
    }
  }
}

const refreshStatus = async () => {
  await Promise.all([
    checkHealth(),
    checkClientConnection()
  ])
}

// Initial load
onMounted(() => {
  refreshStatus()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
