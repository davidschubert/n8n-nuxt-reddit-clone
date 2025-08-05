import { getAppwriteServer } from '../utils/appwrite-server'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }
  
  try {
    const { account } = getAppwriteServer()
    
    // Create session
    const session = await account.createEmailPasswordSession(email, password)
    
    // Set HttpOnly cookie with session data
    setCookie(event, 'session', session.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    // Get user data
    const user = await account.get()
    
    return {
      success: true,
      user: {
        $id: user.$id,
        email: user.email,
        name: user.name
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw createError({
      statusCode: 401,
      statusMessage: error.message || 'Invalid credentials'
    })
  }
})