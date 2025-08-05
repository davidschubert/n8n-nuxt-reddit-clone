import type { ToastMessage } from '~/types'

export const useToastSystem = () => {
  const toasts = ref<ToastMessage[]>([])

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15)
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...toast
    }

    toasts.value.push(newToast)

    // Auto remove toast after duration
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Convenience methods
  const success = (title: string, description?: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'success', title, description, ...options })
  }

  const error = (title: string, description?: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'error', title, description, ...options })
  }

  const warning = (title: string, description?: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'warning', title, description, ...options })
  }

  const info = (title: string, description?: string, options?: Partial<ToastMessage>) => {
    return addToast({ type: 'info', title, description, ...options })
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  }
}