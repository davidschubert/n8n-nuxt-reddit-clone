// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  runtimeConfig: {
    // Private keys (only available on server-side)
    appwriteApiKey: process.env.APPWRITE_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
      appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
      appwriteCollectionPostsId: process.env.APPWRITE_COLLECTION_POSTS_ID,
      appwriteCollectionUsersId: process.env.APPWRITE_COLLECTION_USERS_ID,
      appwriteCollectionCommentsId: process.env.APPWRITE_COLLECTION_COMMENTS_ID,
      appwriteBucketId: process.env.APPWRITE_BUCKET_ID,
    }
  }
})
