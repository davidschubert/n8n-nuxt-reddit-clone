<template>
  <div class="post-page">
    <div class="container">
      <div v-if="postPending" class="loading">
        Lade Post...
      </div>
      
      <div v-else-if="postError" class="error">
        Fehler beim Laden des Posts: {{ postError }}
      </div>
      
      <div v-else-if="post" class="post-content">
        <!-- Post Header -->
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="post-author">von {{ post.author }}</span>
            <span class="post-score">{{ post.score }} Punkte</span>
            <span class="post-date">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
        
        <!-- Post Body -->
        <div class="post-body">
          <p>{{ post.content }}</p>
        </div>
        
        <!-- Post Stats -->
        <div class="post-stats">
          <span class="post-votes">
            ↑ {{ post.upvotes }} ↓ {{ post.downvotes }}
          </span>
          <span class="post-comments">
            {{ post.commentCount }} Kommentare
          </span>
        </div>
        
        <!-- Comments Section -->
        <CommentsList :post-id="postId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/post'

const route = useRoute()
const postId = route.params.id as string

if (!postId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Post ID is required'
  })
}

// Fetch post data
const { data: post, pending: postPending, error: postError } = await useFetch<Post>(`/api/posts/${postId}`)

// SEO and page metadata
useSeoMeta({
  title: computed(() => post.value?.title || 'Post wird geladen...'),
  ogTitle: computed(() => post.value?.title),
  description: computed(() => post.value?.content?.substring(0, 160) || 'Ein Beitrag in unserem Reddit Clone'),
  ogDescription: computed(() => post.value?.content?.substring(0, 160))
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>

<style scoped>
.post-page {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.error {
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.post-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.post-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.post-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.post-author {
  font-weight: 600;
  color: #1f2937;
}

.post-score {
  font-weight: 500;
  color: #059669;
}

.post-body {
  margin-bottom: 1.5rem;
  color: #374151;
  line-height: 1.6;
}

.post-body p {
  margin: 0;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}

.post-votes,
.post-comments {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Responsive design */
@media (max-width: 640px) {
  .post-page {
    padding: 1rem 0;
  }
  
  .container {
    padding: 0 0.5rem;
  }
  
  .post-content {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>