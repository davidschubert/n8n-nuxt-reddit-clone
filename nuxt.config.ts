// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modern Nuxt 4 Features
  future: {
    compatibilityVersion: 4
  },

  // Modules
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // TypeScript Configuration
  typescript: {
    typeCheck: true,
    strict: true
  },

  // CSS Configuration
  css: [
    '~/assets/css/main.css'
  ],

  // App Configuration
  app: {
    head: {
      title: 'Reddit Clone - Nuxt 4 & Appwrite',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Reddit-ähnliches Kommentarsystem mit Nuxt 4 & Appwrite' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Development Configuration
  devServer: {
    port: 3000
  }
})
