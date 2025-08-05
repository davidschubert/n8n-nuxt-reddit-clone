// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // SSR Configuration
  ssr: true,
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    // Server-side keys
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    
    // Public keys (exposed to client)
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID || ''
    }
  },

  // Nitro configuration for server-side security
  nitro: {
    experimental: {
      wasm: true
    }
  },

  // Security headers
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    }
  }
})
