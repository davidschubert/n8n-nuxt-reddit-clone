<template>
  <div class="post-skeleton bg-white rounded-lg shadow-md p-6 animate-pulse">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <!-- Title skeleton -->
        <div class="h-6 bg-gray-200 rounded-md mb-3 w-3/4"></div>
        
        <!-- Meta info skeleton -->
        <div class="flex items-center gap-4">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
          <div class="h-5 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
      
      <!-- Thumbnail skeleton -->
      <div class="ml-4 w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
    </div>

    <!-- Content skeleton -->
    <div class="mb-4 space-y-2">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Tags skeleton -->
    <div class="mb-4 flex gap-2">
      <div class="h-6 bg-gray-200 rounded-md w-16"></div>
      <div class="h-6 bg-gray-200 rounded-md w-20"></div>
      <div class="h-6 bg-gray-200 rounded-md w-14"></div>
    </div>

    <!-- Footer skeleton -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <!-- Vote buttons skeleton -->
      <div class="flex items-center gap-3">
        <div class="h-8 bg-gray-200 rounded-lg w-16"></div>
        <div class="h-8 bg-gray-200 rounded-lg w-8"></div>
      </div>

      <!-- Comments skeleton -->
      <div class="h-8 bg-gray-200 rounded w-24"></div>

      <!-- Share skeleton -->
      <div class="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>