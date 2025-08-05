import { getAppwriteServer } from '../utils/appwrite-server'

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'session')
    
    if (!sessionId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No session found'
      })
    }
    
    const { account } = getAppwriteServer()
    
    // Delete session from Appwrite
    await account.deleteSession(sessionId)
    
    // Remove session cookie
    deleteCookie(event, 'session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    })
    
    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error: any) {
    console.error('Logout error:', error)
    
    // Always remove the cookie even if Appwrite call fails
    deleteCookie(event, 'session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    })
    
    return {
      success: true,
      message: 'Logged out successfully'
    }
  }
})