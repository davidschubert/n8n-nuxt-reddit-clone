<template>
  <div
    v-if="loading.isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="loading-title"
    aria-describedby="loading-description"
  >
    <div class="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 animate-fade-in">
      <!-- Loading spinner -->
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-gray-200 dark:border-gray-600 rounded-full animate-spin">
            <div class="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
          </div>
          
          <!-- Progress indicator if available -->
          <div
            v-if="loading.progress !== undefined"
            class="absolute inset-0 flex items-center justify-center"
          >
            <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
              {{ Math.round(loading.progress) }}%
            </span>
          </div>
        </div>

        <!-- Loading message -->
        <div class="text-center">
          <h3
            id="loading-title"
            class="text-lg font-medium text-gray-900 dark:text-gray-100"
          >
            Loading...
          </h3>
          <p
            v-if="loading.message"
            id="loading-description"
            class="mt-1 text-sm text-gray-600 dark:text-gray-400"
          >
            {{ loading.message }}
          </p>
        </div>

        <!-- Progress bar -->
        <div
          v-if="loading.progress !== undefined"
          class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2"
        >
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            :style="{ width: `${loading.progress}%` }"
            role="progressbar"
            :aria-valuenow="loading.progress"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`Loading progress: ${Math.round(loading.progress)}%`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loading } = useUXState()

// Prevent body scroll when loading overlay is active
watchEffect(() => {
  if (import.meta.client) {
    if (loading.value.isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>