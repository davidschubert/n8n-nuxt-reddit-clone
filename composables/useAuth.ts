// Appwrite Authentication Composable
import { ref, computed, readonly } from 'vue'
import { account } from '../lib/appwrite'
import type { Models } from 'appwrite'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export const useAuth = () => {
  // Reactive State
  const user = ref<Models.User<Models.Preferences> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed Properties
  const isLoggedIn = computed(() => !!user.value)
  const isGuest = computed(() => !user.value)

  // Clear Error Helper
  const clearError = () => {
    error.value = null
  }

  // Get Current User
  const getCurrentUser = async () => {
    try {
      loading.value = true
      clearError()
      
      const currentUser = await account.get()
      user.value = currentUser
      return currentUser
    } catch (err: any) {
      // Benutzer ist nicht eingeloggt
      user.value = null
      console.log('Kein eingeloggter Benutzer gefunden')
      return null
    } finally {
      loading.value = false
    }
  }

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      clearError()

      // Session erstellen
      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      )

      // Benutzerdaten laden
      const currentUser = await account.get()
      user.value = currentUser

      return currentUser
    } catch (err: any) {
      error.value = err.message || 'Login fehlgeschlagen'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (credentials: RegisterCredentials) => {
    try {
      loading.value = true
      clearError()

      // Benutzer registrieren
      await account.create(
        'unique()', // Appwrite generiert automatisch eine ID
        credentials.email,
        credentials.password,
        credentials.name
      )

      // Automatisch einloggen
      await login({
        email: credentials.email,
        password: credentials.password
      })

      return user.value
    } catch (err: any) {
      error.value = err.message || 'Registrierung fehlgeschlagen'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      loading.value = true
      clearError()

      await account.deleteSession('current')
      user.value = null
    } catch (err: any) {
      error.value = err.message || 'Logout fehlgeschlagen'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Password Reset
  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      clearError()

      await account.createRecovery(
        email,
        'http://localhost:3000/reset-password' // URL für Password Reset
      )

      return true
    } catch (err: any) {
      error.value = err.message || 'Password Reset fehlgeschlagen'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update User Preferences
  const updatePreferences = async (prefs: Record<string, any>) => {
    try {
      loading.value = true
      clearError()

      const updatedUser = await account.updatePrefs(prefs)
      user.value = updatedUser

      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Einstellungen konnten nicht aktualisiert werden'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize - wird beim App-Start aufgerufen
  const init = async () => {
    await getCurrentUser()
  }

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    isLoggedIn,
    isGuest,

    // Methods
    login,
    register,
    logout,
    getCurrentUser,
    resetPassword,
    updatePreferences,
    clearError,
    init
  }
}
