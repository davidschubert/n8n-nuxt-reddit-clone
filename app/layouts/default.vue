<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">R</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Reddit Clone</span>
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            <template v-if="isLoggedIn">
              <NuxtLink 
                to="/submit" 
                class="btn-primary text-sm"
              >
                Erstellen
              </NuxtLink>
              <NuxtLink 
                :to="`/user/${user?.name || user?.$id}`"
                class="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <img 
                  :src="user?.prefs?.avatar || 'https://via.placeholder.com/32'" 
                  alt="Avatar" 
                  class="w-8 h-8 avatar"
                >
                <span class="text-sm font-medium text-gray-700">{{ user?.name }}</span>
              </NuxtLink>
              <button 
                @click="logout"
                class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Abmelden
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-secondary text-sm">
                Anmelden
              </NuxtLink>
              <NuxtLink to="/register" class="btn-primary text-sm">
                Registrieren
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600 text-sm">
          <p>&copy; 2024 Reddit Clone. Erstellt mit Nuxt.js und Appwrite.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, getCurrentUser, logout } = useAuth()

// Initialize user on mount
onMounted(() => {
  getCurrentUser()
})
</script>