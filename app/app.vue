<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtRouteAnnouncer />
    
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-2xl font-bold text-gray-900">Reddit Clone</h1>
          <UButton color="primary" variant="solid" @click="handleInit">
            {{ isReady ? 'Ready!' : 'Get Started' }}
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Reddit Clone</h2>
            <p class="text-lg text-gray-600 mb-8">
              Built with Nuxt 4, Tailwind CSS v4, Nuxt UI, Reka UI, and Pinia
            </p>
          </div>
          
          <!-- Tech Stack Grid -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Tech Stack Test -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Tech Stack Test</h3>
              </template>
              
              <div class="space-y-2 text-left">
                <div 
                  v-for="tech in techStack" 
                  :key="tech"
                  class="flex items-center"
                >
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>{{ tech }} ✓</span>
                </div>
                <div class="flex items-center mt-4">
                  <UIcon 
                    :name="isReady ? 'i-heroicons-check-circle' : 'i-heroicons-clock'" 
                    :class="isReady ? 'text-green-500' : 'text-yellow-500'" 
                    class="mr-2" 
                  />
                  <span>Pinia Store: {{ isReady ? 'Initialized' : 'Waiting' }}</span>
                </div>
              </div>
            </UCard>

            <!-- Reka UI Demo -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Reka UI Components</h3>
              </template>
              
              <RekaUIDemo />
            </UCard>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Test that TypeScript is working
const title = 'Reddit Clone - Nuxt 4 Setup'

// Simple reactive data to test Pinia
const isReady = ref(false)
const techStack = ref([
  'Nuxt 4',
  'Tailwind CSS v4', 
  'Nuxt UI',
  'Reka UI',
  'TypeScript',
  'Pinia'
])

const handleInit = () => {
  isReady.value = !isReady.value
}

// Use Nuxt's built-in head management
useHead({
  title,
  meta: [
    { name: 'description', content: 'A Reddit clone built with Nuxt 4, Tailwind CSS, Nuxt UI, Reka UI, and Pinia' }
  ]
})
</script>
