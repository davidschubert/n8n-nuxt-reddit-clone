import { ref, computed } from 'vue'
import { ID } from 'appwrite'
import { getAccount, getDatabases } from '@/plugins/appwrite.client'

// Mock user data for development
const mockUser = {
  $id: 'mock-user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  prefs: {
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Software developer passionate about Vue.js and Nuxt.js. Love building web applications and learning new technologies.',
    karma: 1247,
    cakeDay: '2023-01-15',
    location: 'San Francisco, CA'
  }
}

export const useAuth = () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const isLoading = ref(false)

  const getCurrentUser = async () => {
    isLoading.value = true
    try {
      // For development, use mock data
      if (process.dev) {
        user.value = mockUser
        return mockUser
      }
      
      const account = getAccount()
      if (account) {
        const currentUser = await account.get()
        user.value = currentUser
        return currentUser
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const account = getAccount()
      if (account) {
        await account.createEmailPasswordSession(email, password)
        await getCurrentUser()
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    isLoading.value = true
    try {
      const account = getAccount()
      if (account) {
        await account.create(ID.unique(), email, password, name)
        await login(email, password)
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      const account = getAccount()
      if (account) {
        await account.deleteSession('current')
        user.value = null
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    isLoading: readonly(isLoading),
    getCurrentUser,
    login,
    register,
    logout
  }
}