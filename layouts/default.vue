<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">
              Reddit Clone
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/profile/testuser" class="text-gray-600 hover:text-gray-900">
              Profile
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>&copy; 2024 Reddit Clone. Built with Nuxt.js</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Default layout for the application
</script>

<style scoped>
/* Layout-specific styles */
</style>