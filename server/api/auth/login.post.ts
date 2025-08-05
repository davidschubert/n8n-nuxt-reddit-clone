import { createServerAppwriteClient } from '../../utils/appwrite'
import { createSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const { email, password } = await readBody(event)

    // Validate input
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    const { account } = createServerAppwriteClient()

    // Create session with Appwrite
    const session = await account.createEmailPasswordSession(email, password)

    // Get user details
    const user = await account.get()

    // Create session cookie
    const sessionData = {
      userId: user.$id,
      email: user.email,
      name: user.name,
      sessionId: session.$id,
      expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }

    createSessionCookie(event, sessionData)

    return {
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    let statusCode = 401
    let statusMessage = 'Invalid email or password'

    if (error.type === 'user_invalid_credentials') {
      statusCode = 401
      statusMessage = 'Invalid email or password'
    } else if (error.type === 'user_blocked') {
      statusCode = 403
      statusMessage = 'Account has been blocked'
    }

    throw createError({
      statusCode,
      statusMessage
    })
  }
})