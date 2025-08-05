<template>
  <div>
    <!-- Welcome Section -->
    <div class="card p-8 mb-8">
      <template v-if="authStore.isAuthenticated">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome back, {{ authStore.currentUser?.name }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          You're successfully logged in. This is your Reddit Clone dashboard.
        </p>
      </template>
      <template v-else>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Reddit Clone
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          A modern Reddit-like platform built with Nuxt 4 and Appwrite. 
          Join our community to share and discover amazing content.
        </p>
        <div class="flex gap-4">
          <NuxtLink to="/register" class="btn-primary">
            Get Started
          </NuxtLink>
          <NuxtLink to="/login" class="btn-secondary">
            Login
          </NuxtLink>
        </div>
      </template>
    </div>

    <!-- Features Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="text-blue-500 mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          User Authentication
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Secure SSR-based authentication with HttpOnly cookies powered by Appwrite.
        </p>
      </div>
      
      <div class="card p-6">
        <div class="text-green-500 mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Modern Tech Stack
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Built with Nuxt 4, Tailwind CSS, Nuxt UI, and Pinia for state management.
        </p>
      </div>
      
      <div class="card p-6">
        <div class="text-purple-500 mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Secure & Fast
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Server-side rendering with secure session management and optimized performance.
        </p>
      </div>
    </div>

    <!-- Call to Action -->
    <div v-if="!authStore.isAuthenticated" class="card p-8 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Ready to join our community?
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Create your account today and start sharing your thoughts with the world.
      </p>
      <NuxtLink to="/register" class="btn-primary">
        Sign Up Now
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

// Set page meta
definePageMeta({
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Reddit Clone - Join the Community',
  description: 'A modern Reddit-like platform built with Nuxt 4 and Appwrite. Join our community to share and discover amazing content.'
})
</script>