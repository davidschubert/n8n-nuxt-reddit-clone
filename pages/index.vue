<template>
  <div class="container">
    <h1>Reddit Clone - Posts</h1>
    <p>Welcome to the Reddit clone built with Nuxt.js and Appwrite!</p>
    
    <div style="margin: 20px 0;">
      <NuxtLink to="/create-post" class="btn btn-primary">Create New Post</NuxtLink>
    </div>

    <div v-if="loading">Loading posts...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="posts.length === 0">
        <p>No posts yet. <NuxtLink to="/create-post">Create the first post!</NuxtLink></p>
      </div>
      <div v-else>
        <div v-for="post in posts" :key="post.$id" class="post-card">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-content">{{ post.content.substring(0, 200) }}{{ post.content.length > 200 ? '...' : '' }}</p>
          <div class="post-meta">
            <span>Created: {{ formatDate(post.$createdAt) }}</span>
            <span>Upvotes: {{ post.upvotes }}</span>
            <span>Comments: {{ post.commentCount }}</span>
            <span v-if="post.tags.length > 0">Tags: {{ post.tags.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post, ApiResponse } from '~/types/post'

const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await $fetch<ApiResponse<Post[]>>('/api/posts')
    if (response.success && response.data) {
      posts.value = response.data
    } else {
      error.value = response.error || 'Failed to fetch posts'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch posts'
  } finally {
    loading.value = false
  }
})

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}
</script>