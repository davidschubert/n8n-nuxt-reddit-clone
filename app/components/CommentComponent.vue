<template>
  <div class="comment-card">
    <div class="flex space-x-3">
      <!-- Vote Buttons -->
      <div class="flex-shrink-0">
        <VoteButtons
          :comment-id="comment.id"
          :score="displayScore"
          :user-vote="displayUserVote"
          :disabled="isOwnComment"
          @vote="handleVote"
        />
      </div>

      <!-- Comment Content -->
      <div class="flex-1 min-w-0">
        <!-- Comment Header -->
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span class="font-medium text-gray-900">{{ comment.author }}</span>
          <span>·</span>
          <time :datetime="comment.createdAt.toISOString()">
            {{ formatDate(comment.createdAt) }}
          </time>
        </div>

        <!-- Comment Text -->
        <div class="text-gray-900 mb-3">
          {{ comment.content }}
        </div>

        <!-- Comment Actions -->
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <button class="hover:text-gray-700 transition-colors">
            Reply
          </button>
          <button class="hover:text-gray-700 transition-colors">
            Share
          </button>
          <button class="hover:text-gray-700 transition-colors">
            Report
          </button>
        </div>
      </div>
    </div>

    <!-- Replies -->
    <div v-if="comment.replies && comment.replies.length > 0" class="ml-8 mt-4 space-y-3">
      <CommentComponent
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :current-user="currentUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'

interface Props {
  comment: Comment
  currentUser?: string
}

const props = defineProps<Props>()

const voteStore = useVoteStore()

// Check if this is the current user's comment (disable voting)
const isOwnComment = computed(() => {
  return props.currentUser === props.comment.author
})

// Get reactive score and vote from store
const displayScore = computed(() => 
  voteStore.getScore(props.comment.id) ?? props.comment.score
)

const displayUserVote = computed(() => 
  voteStore.getVote(props.comment.id) ?? props.comment.userVote
)

const handleVote = (voteType: 'upvote' | 'downvote') => {
  console.log(`Vote ${voteType} on comment ${props.comment.id}`)
}

// Format date for display
const formatDate = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

// Initialize comment in store
onMounted(() => {
  voteStore.initializeComment(
    props.comment.id,
    props.comment.score,
    props.comment.userVote
  )
})
</script>