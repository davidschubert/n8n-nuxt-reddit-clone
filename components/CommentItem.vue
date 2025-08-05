<template>
  <div class="comment" :class="{ 'comment--controversial': isControversial }">
    <div class="comment__header">
      <span class="comment__author">{{ comment.author }}</span>
      <span class="comment__score" :class="scoreClass">{{ comment.score }} Punkte</span>
      <span class="comment__date">{{ formatDate(comment.createdAt) }}</span>
    </div>
    <div class="comment__content">
      {{ comment.content }}
    </div>
    <div class="comment__stats">
      <span class="comment__votes">
        ↑ {{ comment.upvotes }} ↓ {{ comment.downvotes }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types/comment'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()

const isControversial = computed(() => {
  const total = props.comment.upvotes + props.comment.downvotes
  if (total < 10) return false
  
  const ratio = Math.min(props.comment.upvotes, props.comment.downvotes) / total
  return ratio > 0.3 // More than 30% minority votes
})

const scoreClass = computed(() => {
  if (props.comment.score > 10) return 'comment__score--high'
  if (props.comment.score < 0) return 'comment__score--negative'
  return ''
})

const formatDate = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'vor wenigen Minuten'
  if (diffHours < 24) return `vor ${diffHours}h`
  
  const diffDays = Math.floor(diffHours / 24)
  return `vor ${diffDays}d`
}
</script>

<style scoped>
.comment {
  padding: 1rem;
  border-left: 3px solid #e5e7eb;
  margin-bottom: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.comment:hover {
  background-color: #f3f4f6;
  border-left-color: #9ca3af;
}

.comment--controversial {
  border-left-color: #f59e0b;
  background-color: #fffbeb;
}

.comment--controversial:hover {
  background-color: #fef3c7;
}

.comment__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.comment__author {
  font-weight: 600;
  color: #1f2937;
}

.comment__score {
  font-weight: 500;
  color: #6b7280;
}

.comment__score--high {
  color: #059669;
}

.comment__score--negative {
  color: #dc2626;
}

.comment__date {
  color: #9ca3af;
}

.comment__content {
  color: #374151;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.comment__stats {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment__votes {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>