<template>
  <div class="comment-section bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header with sort controls -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900">
          Kommentare ({{ totalComments }})
        </h2>
        
        <!-- Sort Controls -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Sortieren nach:</span>
          <select
            v-model="selectedSort"
            @change="onSortChange"
            class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option
              v-for="sort in COMMENT_SORTS"
              :key="`${sort.field}-${sort.direction}`"
              :value="sort"
            >
              {{ sort.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- New Comment Form -->
      <CommentForm
        :post-id="postId"
        @comment-created="onNewComment"
      />
    </div>

    <!-- Comments List -->
    <div class="p-6">
      <!-- Loading State -->
      <div v-if="loading && comments.length === 0" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-500">Kommentare werden geladen...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-600 mb-2">
          <svg class="h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="refreshComments"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="comments.length === 0" class="text-center py-8">
        <svg class="h-12 w-12 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <p class="mt-2 text-gray-500">Noch keine Kommentare vorhanden.</p>
        <p class="text-sm text-gray-400">Sei der Erste, der kommentiert!</p>
      </div>

      <!-- Comments -->
      <div v-else class="space-y-4">
        <CommentItem
          v-for="comment in comments"
          :key="comment.$id"
          :comment="comment"
          :current-user-id="currentUserId"
          @reply-created="onReplyCreated"
        />
      </div>

      <!-- Load More Button (for pagination in future) -->
      <div v-if="hasMore" class="text-center mt-6">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <span v-if="loading">Laden...</span>
          <span v-else>Mehr Kommentare laden</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment, CommentSort } from '~/types/comment'
import { COMMENT_SORTS } from '~/types/comment'

interface Props {
  postId: string
  currentUserId?: string
}

const props = defineProps<Props>()

const {
  comments,
  loading,
  error,
  currentSort,
  fetchComments,
  sortComments
} = useComments()

const selectedSort = ref<CommentSort>(COMMENT_SORTS[0])
const hasMore = ref(false) // For future pagination

const totalComments = computed(() => {
  const countComments = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countComments(comment.replies) : 0)
    }, 0)
  }
  return countComments(comments.value)
})

const onSortChange = () => {
  sortComments(selectedSort.value)
}

const onNewComment = (comment: Comment) => {
  // Comment is automatically added to the list by the composable
  console.log('New comment created:', comment)
}

const onReplyCreated = (reply: Comment) => {
  // Reply is automatically added to the parent comment by the composable
  console.log('Reply created:', reply)
}

const refreshComments = () => {
  fetchComments(props.postId)
}

const loadMore = () => {
  // TODO: Implement pagination
  console.log('Load more comments')
}

// Initialize on mount
onMounted(() => {
  fetchComments(props.postId)
})

// Watch for post ID changes
watch(() => props.postId, (newPostId) => {
  if (newPostId) {
    fetchComments(newPostId)
  }
})
</script>

<style scoped>
.comment-section {
  max-width: 100%;
}
</style>