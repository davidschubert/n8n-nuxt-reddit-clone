export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // Check if user is trying to access protected route
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})