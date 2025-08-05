// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  typescript: {
    strict: true
  },
  ssr: true,
  nitro: {
    preset: 'node-server'
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    appwriteApiKey: process.env.APPWRITE_API_KEY,
    // Public keys (exposed to client-side)
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
      appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
      appwriteCommentsCollectionId: process.env.APPWRITE_COMMENTS_COLLECTION_ID,
      appwritePostsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID
    }
  }
})
