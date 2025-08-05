import { defineStore } from 'pinia'
import type { Models } from 'appwrite'

interface AuthState {
  user: Models.User<Models.Preferences> | null
  isLoggedIn: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.user,
    currentUser: (state) => state.user,
  },

  actions: {
    setUser(user: Models.User<Models.Preferences> | null) {
      this.user = user
      this.isLoggedIn = !!user
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    async login(email: string, password: string) {
      this.setLoading(true)
      try {
        await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        
        // Get user data after successful login
        await this.fetchUser()
        return { success: true }
      } catch (error: any) {
        console.error('Login error:', error)
        return { 
          success: false, 
          error: error.data?.message || 'Login failed'
        }
      } finally {
        this.setLoading(false)
      }
    },

    async register(email: string, password: string, name: string) {
      this.setLoading(true)
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: { email, password, name }
        })
        
        // Auto-login after registration
        return await this.login(email, password)
      } catch (error: any) {
        console.error('Registration error:', error)
        return { 
          success: false, 
          error: error.data?.message || 'Registration failed'
        }
      } finally {
        this.setLoading(false)
      }
    },

    async logout() {
      this.setLoading(true)
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST'
        })
        
        this.setUser(null)
        await navigateTo('/login')
        return { success: true }
      } catch (error: any) {
        console.error('Logout error:', error)
        return { 
          success: false, 
          error: error.data?.message || 'Logout failed'
        }
      } finally {
        this.setLoading(false)
      }
    },

    async fetchUser() {
      try {
        const user = await $fetch('/api/auth/user')
        this.setUser(user)
        return user
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.setUser(null)
        return null
      }
    },

    async initAuth() {
      // Check if user is authenticated on app initialization
      try {
        await this.fetchUser()
      } catch (error) {
        // User is not authenticated, which is fine
        this.setUser(null)
      }
    }
  }
})