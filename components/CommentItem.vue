<template>
  <article 
    :class="['comment', { nested: comment.depth > 0 }]"
    :style="{ marginLeft: `${Math.min(comment.depth * 20, 200)}px` }"
  >
    <div class="comment-content">
      <header class="comment-header">
        <span class="comment-author">{{ comment.author?.username || 'Anonymous' }}</span>
        <span class="comment-time">{{ formatTimeAgo(comment.createdAt) }}</span>
        <span v-if="comment.depth > 0" class="comment-depth">Level {{ comment.depth }}</span>
      </header>
      
      <div class="comment-text" v-html="sanitizedContent"></div>
      
      <div class="comment-actions">
        <button 
          class="comment-action"
          @click="toggleReply"
          :disabled="!canReply"
        >
          {{ showReplyForm ? 'Cancel' : 'Reply' }}
        </button>
        
        <button class="comment-action" @click="upvote">
          ↑ {{ comment.upvotes }}
        </button>
        
        <button class="comment-action" @click="downvote">
          ↓ {{ comment.downvotes }}
        </button>
        
        <button 
          v-if="hasMoreReplies"
          class="comment-action"
          @click="loadMoreReplies"
          :disabled="loadingReplies"
        >
          {{ loadingReplies ? 'Loading...' : `Load ${comment.replyCount - (comment.replies?.length || 0)} more replies` }}
        </button>
      </div>
      
      <!-- Reply form -->
      <div v-if="showReplyForm" class="reply-form">
        <CommentForm 
          :post-id="comment.postId"
          :parent-id="comment.$id"
          @submitted="handleReplySubmitted"
          @cancelled="showReplyForm = false"
        />
      </div>
    </div>
    
    <!-- Nested replies -->
    <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
      <CommentItem 
        v-for="reply in comment.replies"
        :key="reply.$id"
        :comment="reply"
        :max-depth="maxDepth"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'
import { useCommentsStore } from '~/stores/comments'

interface Props {
  comment: Comment
  maxDepth?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 5
})

const commentsStore = useCommentsStore()
const showReplyForm = ref(false)
const loadingReplies = ref(false)

// Computed properties
const canReply = computed(() => props.comment.depth < props.maxDepth)

const hasMoreReplies = computed(() => {
  const repliesCount = props.comment.replies?.length || 0
  return props.comment.replyCount > repliesCount
})

const sanitizedContent = computed(() => {
  // Simple HTML sanitization - in production, use a proper sanitization library
  return props.comment.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
})

// Methods
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString()
}

const toggleReply = () => {
  if (!canReply.value) return
  showReplyForm.value = !showReplyForm.value
}

const handleReplySubmitted = () => {
  showReplyForm.value = false
}

const loadMoreReplies = async () => {
  if (loadingReplies.value) return
  
  loadingReplies.value = true
  try {
    const offset = props.comment.replies?.length || 0
    const newReplies = await commentsStore.loadMoreReplies(props.comment.$id, 10, offset)
    
    // Add new replies to the comment
    if (props.comment.replies) {
      props.comment.replies.push(...newReplies)
    } else {
      props.comment.replies = newReplies
    }
  } catch (error) {
    console.error('Failed to load more replies:', error)
  } finally {
    loadingReplies.value = false
  }
}

const upvote = () => {
  // TODO: Implement voting logic
  console.log('Upvote comment:', props.comment.$id)
}

const downvote = () => {
  // TODO: Implement voting logic
  console.log('Downvote comment:', props.comment.$id)
}
</script>

<style scoped>
.reply-form {
  margin-top: 12px;
  padding-left: 20px;
  border-left: 2px solid #eee;
}

.comment-replies {
  margin-top: 12px;
}

.comment-depth {
  font-size: 10px;
  background: #f6f7f8;
  padding: 2px 6px;
  border-radius: 2px;
}

.comment-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-action:disabled:hover {
  color: #878a8c;
}
</style>