import { defineStore } from 'pinia'
import type { 
  AuthState, 
  User, 
  Session, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse 
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    session: null
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.user && !!state.session,
    currentUser: (state) => state.user,
    sessionExpiry: (state) => state.session?.expiresAt ? new Date(state.session.expiresAt) : null,
    isSessionExpired: (state) => {
      if (!state.session?.expiresAt) return true
      return new Date() >= new Date(state.session.expiresAt)
    }
  },

  actions: {
    // Initialize auth state from storage (for SSR hydration)
    async initializeAuth() {
      this.isLoading = true
      
      try {
        // On client side, check localStorage for persisted session
        if (process.client) {
          const savedSession = localStorage.getItem('auth-session')
          const savedUser = localStorage.getItem('auth-user')
          
          if (savedSession && savedUser) {
            const session = JSON.parse(savedSession) as Session
            const user = JSON.parse(savedUser) as User
            
            // Check if session is still valid
            if (!this.isSessionExpired) {
              this.setAuthData(user, session)
              await this.validateSession()
            } else {
              this.clearAuth()
            }
          }
        }
        
        // On server side, check for session cookie
        if (process.server) {
          const nuxtApp = useNuxtApp()
          const sessionCookie = useCookie('auth-session', {
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
          
          if (sessionCookie.value) {
            try {
              const session = JSON.parse(sessionCookie.value as string) as Session
              
              if (!this.isSessionExpired) {
                // Validate session with backend
                await this.validateSession()
              } else {
                this.clearAuth()
              }
            } catch (error) {
              console.error('Failed to parse session cookie:', error)
              this.clearAuth()
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        this.clearAuth()
      } finally {
        this.isLoading = false
      }
    },

    // Login action
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      
      try {
        // Simulate API call - replace with actual API endpoint
        const response = await $fetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        this.setAuthData(response.user, response.session)
        this.persistSession(response.session)
        
        return { success: true }
      } catch (error) {
        console.error('Login failed:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Login failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // Register action
    async register(credentials: RegisterCredentials) {
      this.isLoading = true
      
      try {
        // Simulate API call - replace with actual API endpoint
        const response = await $fetch<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: credentials
        })
        
        this.setAuthData(response.user, response.session)
        this.persistSession(response.session)
        
        return { success: true }
      } catch (error) {
        console.error('Registration failed:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Registration failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // Logout action
    async logout() {
      this.isLoading = true
      
      try {
        // Call logout endpoint to invalidate session on server
        if (this.session) {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.session.token}`
            }
          })
        }
      } catch (error) {
        console.error('Logout API call failed:', error)
      } finally {
        this.clearAuth()
        this.isLoading = false
      }
    },

    // Refresh session
    async refreshSession() {
      if (!this.session?.refreshToken) {
        this.clearAuth()
        return false
      }

      try {
        const response = await $fetch<AuthResponse>('/api/auth/refresh', {
          method: 'POST',
          body: {
            refreshToken: this.session.refreshToken
          }
        })
        
        this.setAuthData(response.user, response.session)
        this.persistSession(response.session)
        
        return true
      } catch (error) {
        console.error('Session refresh failed:', error)
        this.clearAuth()
        return false
      }
    },

    // Validate current session
    async validateSession() {
      if (!this.session?.token) {
        this.clearAuth()
        return false
      }

      try {
        const response = await $fetch<{ user: User, session: Session }>('/api/auth/validate', {
          headers: {
            Authorization: `Bearer ${this.session.token}`
          }
        })
        
        this.setAuthData(response.user, response.session)
        return true
      } catch (error) {
        console.error('Session validation failed:', error)
        
        // Try to refresh session if validation fails
        if (this.session?.refreshToken) {
          return await this.refreshSession()
        }
        
        this.clearAuth()
        return false
      }
    },

    // Set auth data (user and session)
    setAuthData(user: User, session: Session) {
      this.user = user
      this.session = session
      this.isLoggedIn = true
    },

    // Clear auth state
    clearAuth() {
      this.user = null
      this.session = null
      this.isLoggedIn = false
      
      // Clear persisted data
      if (process.client) {
        localStorage.removeItem('auth-session')
        localStorage.removeItem('auth-user')
      }
      
      // Clear cookies
      const sessionCookie = useCookie('auth-session')
      sessionCookie.value = null
    },

    // Persist session data
    persistSession(session: Session) {
      if (process.client) {
        localStorage.setItem('auth-session', JSON.stringify(session))
        localStorage.setItem('auth-user', JSON.stringify(this.user))
      }
      
      // Set secure cookie for SSR
      const sessionCookie = useCookie('auth-session', {
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      sessionCookie.value = JSON.stringify(session)
    },

    // Start auto-refresh timer
    startAutoRefresh() {
      if (process.client && this.session) {
        const expiryTime = new Date(this.session.expiresAt).getTime()
        const now = Date.now()
        const timeUntilExpiry = expiryTime - now
        
        // Refresh 5 minutes before expiry
        const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 60 * 1000)
        
        setTimeout(async () => {
          if (this.isAuthenticated && !this.isSessionExpired) {
            const refreshed = await this.refreshSession()
            if (refreshed) {
              this.startAutoRefresh() // Restart timer
            }
          }
        }, refreshTime)
      }
    }
  },

  // Pinia plugin for hydration
  hydrate(state, initialState) {
    // Ensure proper hydration of state from server to client
    if (initialState) {
      state.user = initialState.user
      state.session = initialState.session
      state.isLoggedIn = initialState.isLoggedIn
      state.isLoading = false
    }
  }
})