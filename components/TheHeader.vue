<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-sm">R</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">Reddit Clone</span>
        </NuxtLink>
        
        <!-- Navigation -->
        <nav class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <!-- Authenticated user menu -->
            <UDropdown :items="userMenuItems">
              <UAvatar 
                :alt="authStore.currentUser?.name" 
                size="sm" 
                class="cursor-pointer"
              />
            </UDropdown>
          </template>
          <template v-else>
            <!-- Guest menu -->
            <NuxtLink 
              to="/login" 
              class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="btn-primary"
            >
              Sign Up
            </NuxtLink>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
const authStore = useAuthStore()

const userMenuItems = [
  [{
    label: authStore.currentUser?.name || 'User',
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/profile'
  }],
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => authStore.logout()
  }]
]
</script>