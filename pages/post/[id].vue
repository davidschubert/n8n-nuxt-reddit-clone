<template>
  <div class="container">
    <div class="post-page">
      <!-- Post content -->
      <article class="post">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span>by {{ post.author }}</span>
          <span>{{ formatDate(post.createdAt) }}</span>
          <span>{{ post.commentCount }} comments</span>
        </div>
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>
      </article>
      
      <!-- Comments section with SSR -->
      <section class="comments-section">
        <CommentsList 
          :post-id="postId"
          :initial-comments="initialComments"
          :show-metrics="true"
          :max-depth="5"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'

// Get route params
const route = useRoute()
const postId = route.params.id as string

// Mock post data (in real app, this would come from API)
const post = {
  id: postId,
  title: getPostTitle(postId),
  content: getPostContent(postId),
  author: 'demo_user',
  createdAt: new Date().toISOString(),
  commentCount: 0
}

// SSR comments fetching
const { comments: initialComments, error } = await useSSRComments(postId, {
  limit: 50,
  depth: 3
})

// Handle error state
if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load comments'
  })
}

// SEO optimization
useHead({
  title: `${post.title} - Reddit Clone`,
  meta: [
    { name: 'description', content: `${post.content.substring(0, 160)}...` },
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.content },
    { property: 'og:type', content: 'article' },
    { property: 'article:author', content: post.author },
    { property: 'article:published_time', content: post.createdAt }
  ],
  link: [
    { rel: 'canonical', href: `https://reddit-clone.example.com/post/${postId}` }
  ]
})

// Structured data for SEO
useSeoMeta({
  title: `${post.title} - Reddit Clone`,
  description: `${post.content.substring(0, 160)}...`,
  ogTitle: post.title,
  ogDescription: post.content,
  ogType: 'article',
  articleAuthor: post.author,
  articlePublishedTime: post.createdAt
})

// Helper functions
function getPostTitle(id: string): string {
  const titles: Record<string, string> = {
    'demo-post': 'Welcome to SSR Comments Demo',
    'performance-demo': 'Performance Test Post with Many Comments',
  }
  return titles[id] || 'Sample Post'
}

function getPostContent(id: string): string {
  const contents: Record<string, string> = {
    'demo-post': 'This is a demonstration of server-side rendered nested comments in a Nuxt.js Reddit clone. The comments below are loaded on the server and hydrated on the client for optimal performance and SEO.',
    'performance-demo': 'This post is designed to test comment loading performance with deeply nested comment threads. It demonstrates lazy loading, caching, and optimistic updates.',
  }
  return contents[id] || 'This is a sample post demonstrating SSR comments functionality.'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.post-page {
  max-width: 800px;
  margin: 0 auto;
}

.post {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #eee;
}

.post-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: #1a1a1b;
}

.post-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #878a8c;
}

.post-content {
  line-height: 1.6;
  color: #1a1a1b;
}

.comments-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #eee;
}

@media (max-width: 768px) {
  .post-page {
    margin: 0 16px;
  }
  
  .post, .comments-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .post-title {
    font-size: 20px;
  }
}
</style>