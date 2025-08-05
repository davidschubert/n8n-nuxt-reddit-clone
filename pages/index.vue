<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Reddit Clone</h1>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-gray-700">
                Welcome, {{ authStore.currentUser?.username }}!
              </span>
              <button 
                @click="handleLogout"
                :disabled="authStore.isLoading"
                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {{ authStore.isLoading ? 'Logging out...' : 'Logout' }}
              </button>
            </template>
            <template v-else>
              <NuxtLink 
                to="/login"
                class="text-blue-600 hover:text-blue-500"
              >
                Login
              </NuxtLink>
              <NuxtLink 
                to="/register"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Reddit Clone
            </h2>
            <p class="text-gray-600 mb-4">
              {{ authStore.isAuthenticated 
                ? 'You are logged in and ready to start posting!' 
                : 'Please log in to start using the application.' 
              }}
            </p>
            
            <!-- Auth Status Debug Info -->
            <div class="mt-8 p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
              <h3 class="font-semibold text-gray-700 mb-2">Auth Status:</h3>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>Authenticated: {{ authStore.isAuthenticated }}</li>
                <li>Loading: {{ authStore.isLoading }}</li>
                <li>User: {{ authStore.currentUser?.username || 'None' }}</li>
                <li>Session Expired: {{ authStore.isSessionExpired }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/')
}

// Initialize auth on page load
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth()
  }
})
</script>