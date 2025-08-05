export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // Redirect authenticated users away from auth pages
  if (isAuthenticated.value && to.path.startsWith('/auth/')) {
    return navigateTo('/')
  }
})