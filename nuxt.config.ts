// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // SSR Configuration
  ssr: true,
  
  // CSS
  css: ['~/assets/css/main.css'],
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo'
  ],
  
  // SEO Configuration
  site: {
    url: 'https://reddit-clone.example.com',
    name: 'Reddit Clone',
    description: 'A modern Reddit-style community platform built with Nuxt 4',
    defaultLocale: 'en'
  },
  
  // App Configuration
  app: {
    head: {
      titleTemplate: '%s | Reddit Clone',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#3b82f6' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Performance optimizations
  experimental: {
    payloadExtraction: false,
  },
  
  // Nitro configuration for better performance
  nitro: {
    compressPublicAssets: true,
    minify: true
  }
})
