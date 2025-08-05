<template>
  <form @submit.prevent="submitComment" class="comment-form">
    <div class="form-group">
      <textarea
        v-model="content"
        placeholder="What are your thoughts?"
        rows="4"
        class="comment-textarea"
        :disabled="submitting"
        required
      ></textarea>
    </div>
    
    <div class="form-actions">
      <button 
        type="submit"
        class="btn btn-primary"
        :disabled="submitting || !content.trim()"
      >
        {{ submitting ? 'Submitting...' : 'Comment' }}
      </button>
      
      <button 
        v-if="parentId"
        type="button"
        class="btn btn-secondary"
        @click="$emit('cancelled')"
        :disabled="submitting"
      >
        Cancel
      </button>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCommentsStore } from '~/stores/comments'

interface Props {
  postId: string
  parentId?: string
}

interface Emits {
  (e: 'submitted', comment: any): void
  (e: 'cancelled'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const commentsStore = useCommentsStore()
const content = ref('')
const submitting = ref(false)
const error = ref('')

const submitComment = async () => {
  if (!content.value.trim() || submitting.value) return
  
  submitting.value = true
  error.value = ''
  
  try {
    // Add optimistic comment first for better UX
    const optimisticComment = commentsStore.addOptimisticComment({
      content: content.value.trim(),
      postId: props.postId,
      parentId: props.parentId,
      authorId: 'current-user', // TODO: Get from auth store
      depth: props.parentId ? 1 : 0 // Calculate proper depth
    })
    
    // Submit to server
    const newComment = await commentsStore.addComment({
      content: content.value.trim(),
      postId: props.postId,
      parentId: props.parentId,
      authorId: 'current-user' // TODO: Get from auth store
    })
    
    // Reset form
    content.value = ''
    emit('submitted', newComment)
    
  } catch (err: any) {
    error.value = err.message || 'Failed to submit comment'
    console.error('Error submitting comment:', err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.comment-form {
  background: white;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-group {
  margin-bottom: 12px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
}

.comment-textarea:focus {
  outline: none;
  border-color: #0079d3;
  box-shadow: 0 0 0 2px rgba(0, 121, 211, 0.1);
}

.comment-textarea:disabled {
  background: #f6f7f8;
  opacity: 0.6;
}

.form-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #0079d3;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0066b3;
}

.btn-secondary {
  background: transparent;
  color: #0079d3;
  border-color: #0079d3;
}

.btn-secondary:hover:not(:disabled) {
  background: #f6f7f8;
}
</style>