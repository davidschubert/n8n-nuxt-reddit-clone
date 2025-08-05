<template>
  <div class="flex flex-col items-center space-y-1">
    <!-- Upvote Button -->
    <button
      @click="handleVote('upvote')"
      :disabled="disabled || isLoading"
      :class="[
        'vote-button upvote',
        {
          'active': userVote === 'upvote',
          'opacity-50 cursor-not-allowed': disabled || isLoading
        }
      ]"
      :aria-label="userVote === 'upvote' ? 'Remove upvote' : 'Upvote'"
    >
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Score Display -->
    <span
      :class="[
        'text-sm font-medium transition-colors duration-200',
        {
          'text-orange-600': userVote === 'upvote',
          'text-blue-600': userVote === 'downvote',
          'text-gray-600': userVote === null
        }
      ]"
    >
      {{ formatScore(score) }}
    </span>

    <!-- Downvote Button -->
    <button
      @click="handleVote('downvote')"
      :disabled="disabled || isLoading"
      :class="[
        'vote-button downvote',
        {
          'active': userVote === 'downvote',
          'opacity-50 cursor-not-allowed': disabled || isLoading
        }
      ]"
      :aria-label="userVote === 'downvote' ? 'Remove downvote' : 'Downvote'"
    >
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VoteType } from '~/types'

interface Props {
  commentId: string
  score: number
  userVote: VoteType
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  vote: [type: 'upvote' | 'downvote']
}>()

const voteStore = useVoteStore()

// Get reactive state from the store
const isLoading = computed(() => voteStore.isVoteLoading(props.commentId))

// Debounced vote handler to prevent rapid clicking
const debouncedVote = useDebounceFn((voteType: 'upvote' | 'downvote') => {
  voteStore.vote(props.commentId, voteType)
  emit('vote', voteType)
}, 300)

const handleVote = (voteType: 'upvote' | 'downvote') => {
  if (props.disabled || isLoading.value) return
  debouncedVote(voteType)
}

// Format score for display (e.g., 1000 -> 1k)
const formatScore = (score: number): string => {
  if (Math.abs(score) >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M'
  } else if (Math.abs(score) >= 1000) {
    return (score / 1000).toFixed(1) + 'k'
  }
  return score.toString()
}

// Initialize the comment in the store when component mounts
onMounted(() => {
  voteStore.initializeComment(props.commentId, props.score, props.userVote)
})

// Watch for external score/vote changes and update store
watch(
  () => [props.score, props.userVote],
  ([newScore, newUserVote]) => {
    voteStore.initializeComment(props.commentId, newScore as number, newUserVote as VoteType)
  }
)
</script>

<style scoped>
/* Additional component-specific styles */
.vote-button {
  @apply select-none;
  touch-action: manipulation; /* Optimize for mobile touch */
}

.vote-button:active {
  @apply scale-95;
}

/* Loading state animation */
.vote-button:disabled {
  @apply pointer-events-none;
}
</style>