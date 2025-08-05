export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Redirect to login page with return URL
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
  
  // Check if session is expired
  if (authStore.isSessionExpired) {
    authStore.clearAuth()
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
        message: 'Session expired. Please log in again.'
      }
    })
  }
})