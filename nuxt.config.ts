// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // The private keys which are only available within server-side
    appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
    appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
    appwriteApiKey: process.env.APPWRITE_API_KEY,
    appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
    appwritePostsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID,
    
    // Keys within public, will be also exposed to the client-side
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
    }
  }
})