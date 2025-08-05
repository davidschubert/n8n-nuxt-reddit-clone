<template>
  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <form @submit.prevent="onSubmit">
      <div class="mb-4">
        <label for="comment-content" class="sr-only">
          {{ parentId ? 'Antwort schreiben' : 'Kommentar schreiben' }}
        </label>
        <textarea
          id="comment-content"
          v-model="content"
          :placeholder="parentId ? 'Antwort schreiben...' : 'Kommentar schreiben...'"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          :disabled="loading"
          required
        />
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          {{ content.length }}/10000 Zeichen
        </div>
        <div class="flex space-x-2">
          <button
            v-if="parentId"
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            :disabled="loading || !content.trim() || content.length > 10000"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wird gepostet...
            </span>
            <span v-else>
              {{ parentId ? 'Antworten' : 'Kommentieren' }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="error" class="mt-2 text-sm text-red-600">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types/comment'

interface Props {
  postId: string
  parentId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  commentCreated: [comment: Comment]
  cancel: []
}>()

const { createComment, loading, error } = useComments()

const content = ref('')

// Mock user data - in real app this would come from auth
const currentUser = {
  id: 'user-123',
  name: 'Test User'
}

const onSubmit = async () => {
  if (!content.value.trim()) return

  const commentData = {
    content: content.value.trim(),
    authorId: currentUser.id,
    authorName: currentUser.name,
    postId: props.postId,
    parentId: props.parentId || null
  }

  const newComment = await createComment(commentData)
  
  if (newComment) {
    content.value = ''
    emit('commentCreated', newComment)
  }
}

// Auto-focus on mount for reply forms
onMounted(() => {
  if (props.parentId) {
    nextTick(() => {
      const textarea = document.getElementById('comment-content') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    })
  }
})
</script>