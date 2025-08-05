<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- Main Application -->
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 py-3">
          <h1 class="text-xl font-bold text-gray-900">
            Reddit Clone - Comment System Demo
          </h1>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <!-- Demo Post -->
        <article class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6">
            <header class="mb-4">
              <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
                <span class="font-medium text-gray-900">demo_user</span>
                <span>•</span>
                <span>2 hours ago</span>
              </div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">
                Welcome to the Comment Editor Demo
              </h1>
            </header>
            
            <div class="prose-content max-w-none">
              <p>
                This is a demonstration of a fully-featured comment system built with Nuxt.js and Vue 3. 
                The comment editor includes:
              </p>
              <ul>
                <li><strong>Markdown support</strong> - Use **bold**, *italic*, and other markdown formatting</li>
                <li><strong>Live preview</strong> - Toggle between edit and preview modes</li>
                <li><strong>@Mentions</strong> - Type @ to mention other users with autocomplete</li>
                <li><strong>Draft auto-save</strong> - Your drafts are automatically saved locally</li>
                <li><strong>Keyboard shortcuts</strong> - Ctrl+Enter to submit, Ctrl+B for bold, etc.</li>
                <li><strong>XSS protection</strong> - All content is sanitized for security</li>
                <li><strong>Rate limiting</strong> - API includes rate limiting protection</li>
                <li><strong>Nested replies</strong> - Support for threaded conversations</li>
              </ul>
              <p>
                Try creating some comments below to test the functionality!
              </p>
            </div>

            <div class="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-200">
              <button class="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <ChevronUp class="w-5 h-5" />
                <span>42</span>
              </button>
              <button class="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <ChevronDown class="w-5 h-5" />
              </button>
              <span class="text-gray-500">|</span>
              <span class="text-gray-500">3 comments</span>
            </div>
          </div>
        </article>

        <!-- Comments Section -->
        <CommentsSection post-id="post-1" />
      </main>

      <!-- Footer -->
      <footer class="mt-12 bg-white border-t border-gray-200">
        <div class="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>
            Reddit Clone Comment System Demo - Built with Nuxt.js, Vue 3, and Tailwind CSS
          </p>
          <p class="mt-1">
            Features: Markdown rendering, @mentions, draft auto-save, XSS protection, and more
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'

// Set page meta
useHead({
  title: 'Reddit Clone - Comment System Demo',
  meta: [
    { name: 'description', content: 'A demonstration of a fully-featured comment system with markdown support, @mentions, and draft auto-save.' }
  ]
})
</script>

<style>
/* Custom styles for the Reddit clone */
.comment-editor {
  @apply border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500;
}

.comment-thread {
  @apply border-l-2 border-gray-200 ml-4 pl-4;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  @apply font-semibold text-gray-900;
}

.markdown-content p {
  @apply mb-3;
}

.markdown-content strong {
  @apply font-semibold;
}

.markdown-content em {
  @apply italic;
}

.markdown-content a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}

.markdown-content pre {
  @apply bg-gray-100 p-3 rounded-lg overflow-x-auto;
}

.markdown-content blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic;
}

.markdown-content ul,
.markdown-content ol {
  @apply mb-3 pl-6;
}

.markdown-content li {
  @apply mb-1;
}

.mention {
  @apply text-blue-600 font-medium bg-blue-50 px-1 rounded;
}
</style>
