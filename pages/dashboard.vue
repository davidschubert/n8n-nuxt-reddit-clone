<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-semibold">Reddit Clone</NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
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
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Protected Dashboard
            </h3>
            <p class="text-gray-600 mb-6">
              This page is only accessible to authenticated users. The auth middleware 
              automatically redirects unauthenticated users to the login page.
            </p>
            
            <div class="bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Authentication Successful
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>You have successfully accessed a protected route!</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Info -->
            <div class="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-700 mb-3">User Information:</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">User ID</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.currentUser?.id }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Username</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.currentUser?.username }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.currentUser?.email }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Created At</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(authStore.currentUser?.createdAt) }}</dd>
                </div>
              </dl>
            </div>

            <!-- Session Info -->
            <div class="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Session Information:</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Session ID</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.session?.id }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Expires At</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(authStore.session?.expiresAt) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Session Expired</dt>
                  <dd class="text-sm text-gray-900">{{ authStore.isSessionExpired ? 'Yes' : 'No' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Auto-refresh Active</dt>
                  <dd class="text-sm text-gray-900">Yes</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>