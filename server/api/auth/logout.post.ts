import { createServerAppwriteClient } from '../../utils/appwrite'
import { clearSessionCookie, getSessionFromCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const sessionData = getSessionFromCookie(event)
    
    if (sessionData) {
      // Delete session from Appwrite
      const { account } = createServerAppwriteClient()
      try {
        await account.deleteSession(sessionData.sessionId)
      } catch (error) {
        // Continue even if Appwrite session deletion fails
        console.warn('Failed to delete Appwrite session:', error)
      }
    }

    // Clear the cookie
    clearSessionCookie(event)

    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error: any) {
    console.error('Logout error:', error)
    
    // Clear the cookie anyway
    clearSessionCookie(event)
    
    return {
      success: true,
      message: 'Logged out successfully'
    }
  }
})