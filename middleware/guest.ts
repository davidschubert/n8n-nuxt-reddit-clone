export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // If user is already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})