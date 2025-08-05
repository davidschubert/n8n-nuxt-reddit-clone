<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
        Welcome to N8N Reddit Clone
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        A modern, accessible, and performant Reddit clone built with Nuxt.js and enhanced UX features.
      </p>
    </div>

    <!-- Demo actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        UX Features Demo
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Test the various UX features implemented in this Epic:
      </p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Loading states -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">Loading States</h3>
          <div class="space-y-2">
            <button
              class="btn btn-primary w-full text-sm"
              @click="demoLoading"
            >
              Test Loading Overlay
            </button>
            <button
              class="btn btn-secondary w-full text-sm"
              @click="demoProgressLoading"
            >
              Test Progress Loading
            </button>
          </div>
        </div>

        <!-- Toast notifications -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">Toast Messages</h3>
          <div class="space-y-2">
            <button
              class="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              @click="demoSuccessToast"
            >
              Success Toast
            </button>
            <button
              class="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              @click="demoErrorToast"
            >
              Error Toast
            </button>
            <button
              class="w-full px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              @click="demoWarningToast"
            >
              Warning Toast
            </button>
            <button
              class="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              @click="demoInfoToast"
            >
              Info Toast
            </button>
          </div>
        </div>

        <!-- Error states -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">Error States</h3>
          <div class="space-y-2">
            <button
              class="btn btn-secondary w-full text-sm border-red-300 text-red-700 hover:bg-red-50"
              @click="demoError"
            >
              Test Error State
            </button>
            <button
              class="btn btn-secondary w-full text-sm border-red-300 text-red-700 hover:bg-red-50"
              @click="demoRetryableError"
            >
              Test Retryable Error
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Accessibility features -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Accessibility Features
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Keyboard Navigation
          </h3>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Tab through all interactive elements</li>
            <li>• Skip to main content link</li>
            <li>• Focus indicators on all elements</li>
            <li>• Escape key closes modals and dropdowns</li>
          </ul>
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Screen Reader Support
          </h3>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Semantic HTML structure</li>
            <li>• ARIA labels and descriptions</li>
            <li>• Live regions for dynamic content</li>
            <li>• Alternative text for images</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Performance & SEO -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Performance & SEO
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Performance Features
          </h3>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Server-side rendering (SSR)</li>
            <li>• Image optimization</li>
            <li>• Code splitting</li>
            <li>• Compression enabled</li>
          </ul>
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
            SEO Optimization
          </h3>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Meta tags and Open Graph</li>
            <li>• Structured data</li>
            <li>• Semantic HTML</li>
            <li>• Mobile-first responsive design</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Show error state if there's an error -->
    <ErrorState v-if="error.hasError" />
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Home - N8N Reddit Clone',
  meta: [
    { name: 'description', content: 'Welcome to the N8N Reddit Clone - a modern, accessible Reddit-like platform.' }
  ]
})

// Composables
const { success, error: toastError, warning, info } = useToastSystem()
const { startLoading, stopLoading, updateProgress, setError, clearError, error } = useUXState()

// Demo functions
const demoLoading = async () => {
  startLoading('Loading awesome content...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  stopLoading()
  success('Loading complete!', 'Content has been loaded successfully.')
}

const demoProgressLoading = async () => {
  startLoading('Processing data...', 0)
  
  for (let i = 0; i <= 100; i += 10) {
    updateProgress(i, `Processing... ${i}%`)
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  stopLoading()
  success('Processing complete!', 'All data has been processed.')
}

const demoSuccessToast = () => {
  success('Success!', 'This is a success toast message.')
}

const demoErrorToast = () => {
  toastError('Error occurred!', 'This is an error toast message.')
}

const demoWarningToast = () => {
  warning('Warning!', 'This is a warning toast message.')
}

const demoInfoToast = () => {
  info('Information', 'This is an info toast message.')
}

const demoError = () => {
  setError('Something went wrong! This is a demo error state.')
}

const demoRetryableError = () => {
  const retry = () => {
    clearError()
    success('Retry successful!', 'The operation completed successfully.')
  }
  setError('Network error occurred', retry, 'ERR_NETWORK_001')
}

// Clear any existing errors on mount
onMounted(() => {
  clearError()
})
</script>