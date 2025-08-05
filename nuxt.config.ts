export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/eslint'
  ],
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // ESLint configuration
  eslint: {
    config: {
      stylistic: true
    }
  },

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // App configuration
  app: {
    head: {
      title: 'Reddit Clone',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern Reddit clone built with Nuxt.js 4 and Appwrite' }
      ]
    }
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    appwriteApiKey: process.env.APPWRITE_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      appwriteEndpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID,
      appwriteDatabaseId: process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID,
      umamiWebsiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID,
      umamiUrl: process.env.NUXT_PUBLIC_UMAMI_URL
    }
  },

  // Build configuration
  nitro: {
    preset: 'node-server'
  },

  // Experimental features
  experimental: {
    typedPages: true
  }
})