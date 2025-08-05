import type { LoadingState, ErrorState } from '~/types'

export const useUXState = () => {
  const loading = ref<LoadingState>({
    isLoading: false,
    message: undefined,
    progress: undefined
  })

  const error = ref<ErrorState>({
    hasError: false,
    error: undefined,
    retry: undefined,
    code: undefined
  })

  // Loading methods
  const startLoading = (message?: string, progress?: number) => {
    loading.value = {
      isLoading: true,
      message,
      progress
    }
    error.value.hasError = false
  }

  const stopLoading = () => {
    loading.value = {
      isLoading: false,
      message: undefined,
      progress: undefined
    }
  }

  const updateProgress = (progress: number, message?: string) => {
    loading.value.progress = progress
    if (message) {
      loading.value.message = message
    }
  }

  // Error methods
  const setError = (errorValue: Error | string, retry?: () => void, code?: string) => {
    error.value = {
      hasError: true,
      error: errorValue,
      retry,
      code
    }
    loading.value.isLoading = false
  }

  const clearError = () => {
    error.value = {
      hasError: false,
      error: undefined,
      retry: undefined,
      code: undefined
    }
  }

  const retryAction = () => {
    if (error.value.retry) {
      clearError()
      error.value.retry()
    }
  }

  // Async wrapper with loading and error handling
  const withLoading = async <T>(
    fn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T | null> => {
    try {
      startLoading(loadingMessage)
      const result = await fn()
      stopLoading()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      return null
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    startLoading,
    stopLoading,
    updateProgress,
    setError,
    clearError,
    retryAction,
    withLoading
  }
}