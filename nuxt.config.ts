// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  ssr: true,
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    // The private keys which are only available within server-side
    appwriteKey: process.env.APPWRITE_API_KEY,
    // Keys within public are also exposed to the client-side
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProject: process.env.APPWRITE_PROJECT_ID,
    }
  },

  // Disable external font providers to avoid network issues in sandboxed environment
  fonts: {
    providers: {
      google: false,
      googleicons: false,
      bunny: false,
      fontshare: false,
      fontsource: false
    }
  }
})
