<template>
  <div 
    v-if="isVisible"
    class="reply-form"
    role="form"
    aria-label="Reply to comment form"
  >
    <div class="reply-form-header">
      <label for="reply-textarea" class="reply-label">Write a reply:</label>
    </div>
    
    <textarea
      id="reply-textarea"
      ref="textareaRef"
      v-model="replyContent"
      class="reply-textarea"
      placeholder="What are your thoughts?"
      rows="3"
      :disabled="isSubmitting"
      @keydown="handleKeydown"
      aria-describedby="reply-help"
    ></textarea>
    
    <div id="reply-help" class="reply-help">
      Press Ctrl+Enter to submit, Esc to cancel
    </div>
    
    <div class="reply-actions">
      <button
        type="button"
        @click="handleSubmit"
        class="submit-button"
        :disabled="!replyContent.trim() || isSubmitting"
        :aria-label="isSubmitting ? 'Submitting reply' : 'Submit reply'"
      >
        <span v-if="isSubmitting" class="loading-spinner"></span>
        {{ isSubmitting ? 'Submitting...' : 'Reply' }}
      </button>
      
      <button
        type="button"
        @click="handleCancel"
        class="cancel-button"
        :disabled="isSubmitting"
        aria-label="Cancel reply"
      >
        Cancel
      </button>
    </div>
    
    <div v-if="error" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReplyFormProps } from '~/types/comment'

interface Props extends ReplyFormProps {}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [content: string]
  cancel: []
}>()

const replyContent = ref('')
const isSubmitting = ref(false)
const error = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

// Focus textarea when form becomes visible
watch(() => props.isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
})

// Handle form submission
const handleSubmit = async () => {
  const content = replyContent.value.trim()
  
  if (!content) {
    error.value = 'Reply cannot be empty'
    return
  }
  
  if (content.length > 1000) {
    error.value = 'Reply must be less than 1000 characters'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    emit('submit', content)
    replyContent.value = ''
  } catch (err) {
    error.value = 'Failed to submit reply. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Handle form cancellation
const handleCancel = () => {
  replyContent.value = ''
  error.value = ''
  emit('cancel')
}

// Handle keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    handleSubmit()
  }
}

// Character count for accessibility
const characterCount = computed(() => replyContent.value.length)
const remainingCharacters = computed(() => 1000 - characterCount.value)
</script>

<style scoped>
.reply-form {
  margin-top: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.reply-form-header {
  margin-bottom: 0.5rem;
}

.reply-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.reply-textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.reply-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.reply-textarea:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.reply-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.submit-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.submit-button:disabled {
  background-color: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.cancel-button {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.cancel-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #374151;
}

.cancel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
  font-size: 0.875rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .reply-form {
    padding: 0.75rem;
  }
  
  .reply-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .submit-button,
  .cancel-button {
    width: 100%;
    justify-content: center;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .reply-form {
    border-color: #000000;
  }
  
  .reply-textarea {
    border-color: #000000;
  }
  
  .reply-textarea:focus {
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3);
  }
}

/* Focus management */
.reply-textarea:focus,
.submit-button:focus,
.cancel-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>