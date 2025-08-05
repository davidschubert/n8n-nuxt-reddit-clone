<template>
  <article class="post-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
    <div class="p-6">
      <!-- Header -->
      <header class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            <NuxtLink 
              :to="`/posts/${post.id}`"
              class="hover:text-blue-600 transition-colors"
            >
              {{ post.title }}
            </NuxtLink>
          </h2>
          
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>by {{ post.author }}</span>
            <span>{{ formatDate(post.createdAt) }}</span>
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {{ post.category }}
            </span>
          </div>
        </div>
        
        <!-- Thumbnail -->
        <div v-if="post.thumbnail" class="ml-4 flex-shrink-0">
          <img 
            :src="post.thumbnail" 
            :alt="post.title"
            class="w-20 h-16 object-cover rounded-lg"
            loading="lazy"
          >
        </div>
      </header>

      <!-- Content -->
      <div class="mb-4">
        <p class="text-gray-700 line-clamp-3">
          {{ post.content }}
        </p>
      </div>

      <!-- Tags -->
      <div v-if="post.tags.length" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs hover:bg-gray-200 transition-colors cursor-pointer"
            @click="$emit('tag-click', tag)"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Footer -->
      <footer class="flex items-center justify-between pt-4 border-t border-gray-100">
        <!-- Vote Section -->
        <div class="flex items-center gap-3">
          <button 
            class="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 transition-colors"
            @click="$emit('upvote', post.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
            <span class="font-medium">{{ post.votes }}</span>
          </button>
          
          <button 
            class="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors"
            @click="$emit('downvote', post.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Comments -->
        <NuxtLink 
          :to="`/posts/${post.id}#comments`"
          class="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{{ post.commentsCount }} comments</span>
        </NuxtLink>

        <!-- Share -->
        <button 
          class="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          @click="sharePost"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Post } from '~/types/posts'

interface Props {
  post: Post
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'upvote': [postId: string]
  'downvote': [postId: string]
  'tag-click': [tag: string]
}>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    if (days < 30) {
      return `${days}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }
}

async function sharePost() {
  const shareData = {
    title: props.post.title,
    text: props.post.content.substring(0, 100) + '...',
    url: `${window.location.origin}/posts/${props.post.id}`
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareData.url)
    // You could show a toast notification here
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-1px);
}
</style>