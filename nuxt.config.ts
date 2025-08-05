export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID || '',
      appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID || 'reddit-clone-db',
      appwriteCommentsCollectionId: process.env.APPWRITE_COMMENTS_COLLECTION_ID || 'comments',
      appwriteCommentVotesCollectionId: process.env.APPWRITE_COMMENT_VOTES_COLLECTION_ID || 'comment-votes',
      appwritePostsCollectionId: process.env.APPWRITE_POSTS_COLLECTION_ID || 'posts',
      appwriteUsersCollectionId: process.env.APPWRITE_USERS_COLLECTION_ID || 'users'
    }
  }
})