export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state on both server and client
  await authStore.initializeAuth()
  
  // Start auto-refresh timer on client side
  if (process.client && authStore.isAuthenticated) {
    authStore.startAutoRefresh()
    
    // Set up periodic session validation (every 5 minutes)
    setInterval(async () => {
      if (authStore.isAuthenticated) {
        await authStore.validateSession()
      }
    }, 5 * 60 * 1000)
  }
})