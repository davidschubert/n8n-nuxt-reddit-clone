// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modules for UX & Optimization
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint'
  ],

  // SEO and Meta configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'N8N Nuxt Reddit Clone',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern Reddit clone built with Nuxt.js and N8N automation' },
        { name: 'author', content: 'David Schubert' },
        { name: 'keywords', content: 'reddit, clone, nuxt, vue, n8n, automation' },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'N8N Nuxt Reddit Clone' },
        { property: 'og:description', content: 'A modern Reddit clone built with Nuxt.js and N8N automation' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://n8n-nuxt-reddit-clone.vercel.app' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'N8N Nuxt Reddit Clone' },
        { name: 'twitter:description', content: 'A modern Reddit clone built with Nuxt.js and N8N automation' },
        { name: 'twitter:image', content: '/og-image.png' },
        
        // Theme and mobile optimization
        { name: 'theme-color', content: '#0ea5e9' },
        { name: 'msapplication-TileColor', content: '#0ea5e9' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  // Performance optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  // CSS configuration for responsive design
  css: ['~/assets/css/main.css'],

  // Accessibility and UX features
  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Experimental features for better performance
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true
  },

  // Route rules for SEO
  routeRules: {
    '/': { prerender: true },
    '/posts/**': { ssr: true },
    '/api/**': { cors: true }
  }
})
