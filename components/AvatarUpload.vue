<template>
  <div class="relative">
    <!-- Upload Button -->
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      :disabled="uploading"
      :title="uploading ? 'Uploading...' : 'Change avatar'"
      @click="triggerFileInput"
    >
      <svg v-if="!uploading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
    </button>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="uploading"
      @change="handleFileSelect"
    >

    <!-- Error Message -->
    <div v-if="error" class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm whitespace-nowrap z-10">
      {{ error }}
    </div>

    <!-- Success Message -->
    <div v-if="success" class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm whitespace-nowrap z-10">
      Avatar updated successfully!
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  allowedTypes: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
})

// Emits
const emit = defineEmits(['upload'])

// Reactive state
const fileInput = ref(null)
const uploading = ref(false)
const error = ref('')
const success = ref(false)

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Clear previous messages
  error.value = ''
  success.value = false

  // Validate file
  if (!validateFile(file)) {
    return
  }

  try {
    uploading.value = true
    const avatarUrl = await uploadFile(file)
    
    success.value = true
    emit('upload', avatarUrl)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
    
  } catch (err) {
    error.value = err.message || 'Upload failed. Please try again.'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    uploading.value = false
    // Clear the input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const validateFile = (file) => {
  // Check file type
  if (!props.allowedTypes.includes(file.type)) {
    error.value = 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    return false
  }

  // Check file size
  if (file.size > props.maxSize) {
    const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(1)
    error.value = `File size must be less than ${maxSizeMB}MB`
    return false
  }

  return true
}

const uploadFile = async (file) => {
  // Mock upload implementation
  // In a real application, this would upload to a server or cloud storage
  return new Promise((resolve, reject) => {
    // Simulate upload delay
    setTimeout(() => {
      try {
        // Create a mock URL for the uploaded avatar
        // In a real app, this would be the actual uploaded file URL
        const mockUrl = URL.createObjectURL(file)
        resolve(mockUrl)
      } catch {
        reject(new Error('Upload failed'))
      }
    }, 1500)
  })
}

// Cleanup
onUnmounted(() => {
  // Clear any pending timeouts and object URLs
  error.value = ''
  success.value = false
})
</script>

<style scoped>
/* Component-specific styles are handled by Tailwind classes */
</style>