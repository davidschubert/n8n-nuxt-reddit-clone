<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'relative flex items-start p-4 rounded-lg shadow-lg border backdrop-blur-sm',
            'animate-slide-up transition-all duration-300',
            toastClasses[toast.type]
          ]"
          role="alert"
          :aria-describedby="`toast-${toast.id}-description`"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mr-3">
            <UIcon
              :name="toastIcons[toast.type]"
              :class="['h-5 w-5', toastIconClasses[toast.type]]"
              :aria-hidden="true"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium">
              {{ toast.title }}
            </h4>
            <p
              v-if="toast.description"
              :id="`toast-${toast.id}-description`"
              class="mt-1 text-xs opacity-90"
            >
              {{ toast.description }}
            </p>
          </div>

          <!-- Close button -->
          <button
            type="button"
            class="ml-3 flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="toastCloseClasses[toast.type]"
            :aria-label="`Close ${toast.type} notification`"
            @click="removeToast(toast.id)"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </button>

          <!-- Progress bar for timed toasts -->
          <div
            v-if="!toast.persistent && toast.duration"
            class="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 animate-shrink"
            :style="{ animationDuration: `${toast.duration}ms` }"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToastSystem()

// Toast styling classes
const toastClasses = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
}

const toastIcons = {
  success: 'i-heroicons-check-circle',
  error: 'i-heroicons-x-circle',
  warning: 'i-heroicons-exclamation-triangle',
  info: 'i-heroicons-information-circle'
}

const toastIconClasses = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400'
}

const toastCloseClasses = {
  success: 'text-green-500 hover:text-green-600 focus:ring-green-600',
  error: 'text-red-500 hover:text-red-600 focus:ring-red-600',
  warning: 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-600',
  info: 'text-blue-500 hover:text-blue-600 focus:ring-blue-600'
}
</script>

<style scoped>
/* Toast transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Progress bar animation */
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-shrink {
  animation: shrink linear;
}
</style>