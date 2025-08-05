import type { User } from '~/types/auth'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    try {
      const data = await $fetch<{
        success: boolean
        user: User
      }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (data.success) {
        user.value = data.user
        return { success: true }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.data?.message || 'Login failed'
      }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = await $fetch<{
        success: boolean
        user: User
      }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, name }
      })

      if (data.success) {
        user.value = data.user
        return { success: true }
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.data?.message || 'Registration failed'
      }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      await navigateTo('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user state anyway
      user.value = null
      await navigateTo('/auth/login')
    }
  }

  const checkSession = async () => {
    try {
      const data = await $fetch<{
        authenticated: boolean
        user: User | null
      }>('/api/auth/session')

      if (data.authenticated && data.user) {
        user.value = data.user
      } else {
        user.value = null
      }

      return data.authenticated
    } catch (error) {
      console.error('Session check error:', error)
      user.value = null
      return false
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    register,
    logout,
    checkSession
  }
}