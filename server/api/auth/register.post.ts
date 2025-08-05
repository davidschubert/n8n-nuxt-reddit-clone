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
    const { email, password, name } = await readBody(event)

    // Validate input
    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, and name are required'
      })
    }

    // Password validation
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }

    const { account, ID } = createServerAppwriteClient()

    // Create user account with Appwrite
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    )

    // Create session
    const session = await account.createEmailPasswordSession(email, password)

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
    console.error('Registration error:', error)
    
    let statusCode = 500
    let statusMessage = 'Internal server error'

    if (error.type === 'user_already_exists') {
      statusCode = 409
      statusMessage = 'A user with this email already exists'
    } else if (error.type === 'user_invalid_credentials') {
      statusCode = 400
      statusMessage = 'Invalid email or password format'
    }

    throw createError({
      statusCode,
      statusMessage
    })
  }
})