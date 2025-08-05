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
    
    // Set session context for server requests
    account.client.setSession(sessionId)
    
    // Get user data
    const user = await account.get()
    
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
      $createdAt: user.$createdAt,
      $updatedAt: user.$updatedAt
    }
  } catch (error: any) {
    console.error('Get user error:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }
})