// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID || '',
      appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID || '',
      appwriteCommentsCollectionId: process.env.APPWRITE_COMMENTS_COLLECTION_ID || '',
      appwriteVotesCollectionId: process.env.APPWRITE_VOTES_COLLECTION_ID || ''
    }
  }
})
