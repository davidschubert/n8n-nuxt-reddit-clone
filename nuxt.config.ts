// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      appwrite: {
        endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
        projectId: process.env.APPWRITE_PROJECT_ID || 'your-project-id',
        databaseId: process.env.APPWRITE_DATABASE_ID || 'your-database-id',
        commentsCollectionId: process.env.APPWRITE_COMMENTS_COLLECTION_ID || 'comments',
        votesCollectionId: process.env.APPWRITE_VOTES_COLLECTION_ID || 'votes',
        postsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID || 'posts'
      }
    }
  }
})