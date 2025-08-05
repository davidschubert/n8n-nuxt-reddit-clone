export default defineNuxtPlugin(async () => {
  // Initialize auth store on client and server
  const authStore = useAuthStore()
  
  // Only initialize auth if we're on the client side or during SSR
  if (process.client || process.server) {
    await authStore.initAuth()
  }
})