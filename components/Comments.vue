<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3>Comments</h3>
      <div class="realtime-indicator" v-if="connectionState.isConnected">
        <div class="live-dot"></div>
        <span>Live</span>
      </div>
    </div>

    <!-- Add Comment Form -->
    <div class="add-comment">
      <textarea
        v-model="newComment"
        placeholder="Add a comment..."
        rows="3"
        class="comment-input"
      />
      <div class="comment-actions">
        <button
          @click="submitComment"
          :disabled="!newComment.trim() || loading"
          class="submit-btn"
        >
          {{ loading ? 'Posting...' : 'Post Comment' }}
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Comments List -->
    <div v-if="loading && comments.length === 0" class="loading">
      Loading comments...
    </div>

    <div v-else class="comments-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.$id"
        :comment="comment"
        @vote="handleVote"
        @reply="handleReply"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && comments.length === 0" class="empty-state">
      <p>No comments yet. Be the first to comment!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  postId: string
}

const props = defineProps<Props>()

const { comments, loading, error, addComment, voteComment } = useComments(props.postId)
const { connectionState } = useAppwrite()

const newComment = ref('')

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  await addComment(newComment.value)
  newComment.value = ''
}

const handleVote = async (commentId: string, voteType: 'up' | 'down') => {
  await voteComment(commentId, voteType)
}

const handleReply = async (commentId: string, content: string) => {
  await addComment(content, commentId)
}
</script>

<style scoped>
.comments-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.comments-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.realtime-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.live-dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.add-comment {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.comment-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
}

.comment-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.loading {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

.comments-list {
  space-y: 16px;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

.empty-state p {
  margin: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>