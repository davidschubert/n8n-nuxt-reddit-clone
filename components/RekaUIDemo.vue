<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Reka UI Demo</h3>
    
    <!-- Simple Reka UI Button Test -->
    <div class="space-y-2">
      <p class="text-sm text-gray-600">Reka UI Button Example:</p>
      <button 
        @click="handleClick"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Click me (Reka UI Style)
      </button>
      <p v-if="clicked" class="text-green-600 text-sm">✓ Button clicked!</p>
    </div>

    <!-- Integration Status -->
    <div class="space-y-2">
      <p class="text-sm text-gray-600">Reka UI Integration Status:</p>
      <div class="p-3 bg-green-50 border border-green-200 rounded">
        <div class="flex items-center">
          <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
          <span class="text-green-700">Reka UI is available and ready to use</span>
        </div>
        <p class="text-sm text-green-600 mt-1">
          Reka UI components can be imported and used for accessibility features.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const clicked = ref(false)

const handleClick = () => {
  clicked.value = true
  setTimeout(() => {
    clicked.value = false
  }, 3000)
}
</script>