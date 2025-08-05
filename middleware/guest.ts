export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // If user is already authenticated, redirect to home or dashboard
  if (authStore.isAuthenticated && !authStore.isSessionExpired) {
    return navigateTo('/')
  }
})