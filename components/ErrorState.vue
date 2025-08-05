<template>
  <div
    v-if="error.hasError"
    class="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-fade-in"
    role="alert"
    aria-live="assertive"
  >
    <!-- Error icon -->
    <div class="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-8 h-8 text-red-600 dark:text-red-400"
        aria-hidden="true"
      />
    </div>

    <!-- Error message -->
    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {{ title }}
    </h2>
    
    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
      {{ errorMessage }}
    </p>

    <!-- Error code if available -->
    <p
      v-if="error.code"
      class="text-xs text-gray-500 dark:text-gray-500 mb-4 font-mono"
    >
      Error Code: {{ error.code }}
    </p>

    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row gap-3">
      <UButton
        v-if="error.retry"
        color="primary"
        @click="handleRetry"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-4 h-4 mr-2"
        />
        Try Again
      </UButton>
      
      <UButton
        color="white"
        @click="clearError"
      >
        <UIcon
          name="i-heroicons-home"
          class="w-4 h-4 mr-2"
        />
        Go Home
      </UButton>
    </div>

    <!-- Additional help -->
    <details class="mt-6 max-w-md">
      <summary class="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
        Need help?
      </summary>
      <div class="mt-2 text-xs text-gray-600 dark:text-gray-400 text-left">
        <p class="mb-2">If this error persists, try:</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Checking your internet connection</li>
          <li>Refreshing the page</li>
          <li>Clearing your browser cache</li>
          <li>Contacting support if the issue continues</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  showRetry?: boolean
  showHome?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  showRetry: true,
  showHome: true
})

const { error, clearError, retryAction } = useUXState()
const { error: toastError } = useToastSystem()

const errorMessage = computed(() => {
  if (typeof error.value.error === 'string') {
    return error.value.error
  }
  if (error.value.error instanceof Error) {
    return error.value.error.message
  }
  return 'An unexpected error occurred. Please try again.'
})

const handleRetry = () => {
  try {
    retryAction()
  } catch (err) {
    toastError('Retry failed', 'Please try again later')
  }
}

const router = useRouter()

const goHome = () => {
  clearError()
  router.push('/')
}
</script>