export default defineNuxtPlugin({
  name: 'appwrite',
  async setup() {
    // Only initialize on client-side
    if (process.client) {
      try {
        // Initialize Appwrite client
        const appwrite = createAppwriteClient()
        
        // Test connection
        await appwrite.account.get().catch(() => {
          // User not logged in, which is fine
          console.log('Appwrite client initialized successfully')
        })
        
        return {
          provide: {
            appwrite
          }
        }
      } catch (error) {
        console.error('Failed to initialize Appwrite:', error)
        // Don't fail the app, just log the error
      }
    }
  }
})