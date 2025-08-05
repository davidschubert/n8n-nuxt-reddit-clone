import { getSessionFromCookie, refreshSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  try {
    const sessionData = getSessionFromCookie(event)
    
    if (!sessionData) {
      return {
        authenticated: false,
        user: null
      }
    }

    // Refresh the session cookie to extend expiry
    refreshSessionCookie(event, sessionData)

    return {
      authenticated: true,
      user: {
        id: sessionData.userId,
        email: sessionData.email,
        name: sessionData.name
      }
    }
  } catch (error: any) {
    console.error('Session check error:', error)
    
    return {
      authenticated: false,
      user: null
    }
  }
})