<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3 class="comments-title">
        Kommentare ({{ comments.length }})
      </h3>
      <CommentSortDropdown 
        v-model="currentSort" 
        @change="onSortChange"
      />
    </div>
    
    <div v-if="pending" class="comments-loading">
      Lade Kommentare...
    </div>
    
    <div v-else-if="error" class="comments-error">
      Fehler beim Laden der Kommentare: {{ error }}
    </div>
    
    <div v-else class="comments-list">
      <TransitionGroup name="comment" tag="div">
        <CommentItem 
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment, CommentSortType } from '~/types/comment'

interface Props {
  postId: string
}

const props = defineProps<Props>()

// Reactive state for current sort
const currentSort = ref<CommentSortType>('popular')

// Route for URL state management
const route = useRoute()
const router = useRouter()

// Initialize sort from URL query parameter
onMounted(() => {
  const sortFromUrl = route.query.sort as CommentSortType
  if (sortFromUrl && ['popular', 'new', 'old', 'controversial'].includes(sortFromUrl)) {
    currentSort.value = sortFromUrl
  }
})

// Fetch comments data with sorting
const { data, pending, error, refresh } = await useFetch<{
  comments: Comment[]
  sortBy: CommentSortType
  total: number
}>(`/api/posts/${props.postId}/comments`, {
  query: {
    sort: currentSort
  },
  key: `comments-${props.postId}-${currentSort.value}`
})

const comments = computed(() => data.value?.comments || [])

// Handle sort change
const onSortChange = async (newSort: CommentSortType) => {
  currentSort.value = newSort
  
  // Update URL with new sort parameter
  await router.push({
    query: {
      ...route.query,
      sort: newSort
    }
  })
  
  // Refresh data
  await refresh()
}

// Watch for URL changes (e.g., back/forward navigation)
watch(() => route.query.sort, (newSort) => {
  if (newSort && newSort !== currentSort.value) {
    currentSort.value = newSort as CommentSortType
  }
})
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.comments-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.comments-loading,
.comments-error {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.comments-error {
  color: #dc2626;
  background-color: #fef2f2;
  border-radius: 0.375rem;
  border: 1px solid #fecaca;
}

.comments-list {
  space-y: 1rem;
}

/* Transition animations */
.comment-enter-active,
.comment-leave-active {
  transition: all 0.3s ease;
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.comment-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.comment-move {
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 640px) {
  .comments-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>