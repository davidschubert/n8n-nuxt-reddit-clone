<template>
  <div class="comment-item" :class="{ 'is-reply': !!comment.parentId }">
    <div class="comment-content">
      <div class="comment-header">
        <div class="comment-author">
          <strong>{{ comment.author?.username || 'Anonymous' }}</strong>
          <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
        </div>
        <div v-if="isNew" class="new-badge">New</div>
      </div>

      <div class="comment-text">
        {{ comment.content }}
      </div>

      <div class="comment-actions">
        <div class="vote-buttons">
          <button
            @click="$emit('vote', comment.$id, 'up')"
            :class="{ active: comment.userVote === 'up' }"
            class="vote-btn upvote"
          >
            ↑ {{ upvotes }}
          </button>
          <button
            @click="$emit('vote', comment.$id, 'down')"
            :class="{ active: comment.userVote === 'down' }"
            class="vote-btn downvote"
          >
            ↓ {{ downvotes }}
          </button>
        </div>

        <button @click="toggleReply" class="action-btn">
          Reply
        </button>

        <div class="vote-score" :class="voteScoreClass">
          {{ comment.votes }}
        </div>
      </div>

      <!-- Reply Form -->
      <div v-if="showReplyForm" class="reply-form">
        <textarea
          v-model="replyContent"
          placeholder="Write a reply..."
          rows="2"
          class="reply-input"
        />
        <div class="reply-actions">
          <button @click="submitReply" :disabled="!replyContent.trim()" class="submit-reply">
            Reply
          </button>
          <button @click="cancelReply" class="cancel-reply">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Replies -->
    <div v-if="comment.replies && comment.replies.length > 0" class="replies">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.$id"
        :comment="reply"
        @vote="$emit('vote', $event, arguments[1])"
        @reply="$emit('reply', $event, arguments[1])"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/composables/useComments'

interface Props {
  comment: Comment
}

interface Emits {
  (e: 'vote', commentId: string, voteType: 'up' | 'down'): void
  (e: 'reply', commentId: string, content: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showReplyForm = ref(false)
const replyContent = ref('')

// Check if comment is new (created in last 30 seconds)
const isNew = computed(() => {
  const commentTime = new Date(props.comment.createdAt).getTime()
  const now = Date.now()
  return now - commentTime < 30000 // 30 seconds
})

// Calculate vote counts (simplified)
const upvotes = computed(() => {
  // In a real app, you'd track individual votes
  return Math.max(0, Math.floor(props.comment.votes / 2))
})

const downvotes = computed(() => {
  // In a real app, you'd track individual votes  
  return Math.max(0, Math.floor(-props.comment.votes / 2))
})

const voteScoreClass = computed(() => {
  if (props.comment.votes > 0) return 'positive'
  if (props.comment.votes < 0) return 'negative'
  return 'neutral'
})

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value
  if (!showReplyForm.value) {
    replyContent.value = ''
  }
}

const submitReply = () => {
  if (replyContent.value.trim()) {
    emit('reply', props.comment.$id, replyContent.value)
    replyContent.value = ''
    showReplyForm.value = false
  }
}

const cancelReply = () => {
  replyContent.value = ''
  showReplyForm.value = false
}

// Animate new comments
onMounted(() => {
  if (isNew.value) {
    // Auto-hide new badge after 5 seconds
    setTimeout(() => {
      // This would update the isNew computed in a real implementation
    }, 5000)
  }
})
</script>

<style scoped>
.comment-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
  transition: all 0.3s ease;
}

.comment-item.is-reply {
  margin-left: 32px;
  border-left: 3px solid #e5e7eb;
  background: #fafafa;
}

.comment-content {
  padding: 16px;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-author strong {
  color: #1f2937;
  font-size: 14px;
}

.comment-time {
  color: #6b7280;
  font-size: 12px;
}

.new-badge {
  background: #10b981;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  animation: slideIn 0.3s ease;
}

.comment-text {
  color: #374151;
  line-height: 1.5;
  margin-bottom: 12px;
  font-size: 14px;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vote-buttons {
  display: flex;
  gap: 4px;
}

.vote-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.vote-btn:hover {
  background: #e5e7eb;
}

.vote-btn.active.upvote {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.vote-btn.active.downvote {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.action-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.vote-score {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.vote-score.positive {
  color: #10b981;
  background: #ecfdf5;
}

.vote-score.negative {
  color: #ef4444;
  background: #fef2f2;
}

.vote-score.neutral {
  color: #6b7280;
  background: #f3f4f6;
}

.reply-form {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.reply-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  resize: vertical;
}

.reply-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.reply-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.submit-reply {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.submit-reply:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.cancel-reply {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.replies {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Highlight animation for new comments */
.comment-item:has(.new-badge) {
  animation: highlightNew 3s ease;
}

@keyframes highlightNew {
  0% {
    background-color: #ecfdf5;
    box-shadow: 0 0 0 2px #10b981;
  }
  100% {
    background-color: white;
    box-shadow: none;
  }
}
</style>