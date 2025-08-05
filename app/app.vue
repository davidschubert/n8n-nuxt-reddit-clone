<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Global SEO configuration
useSeoMeta({
  title: 'N8N Nuxt Reddit Clone',
  ogTitle: 'N8N Nuxt Reddit Clone',
  description: 'A modern Reddit clone built with Nuxt.js featuring excellent UX, accessibility, and performance.',
  ogDescription: 'A modern Reddit clone built with Nuxt.js featuring excellent UX, accessibility, and performance.',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  themeColor: '#0ea5e9'
})

// Initialize global composables
const { } = useToastSystem()
const { } = useUXState()
</script>
