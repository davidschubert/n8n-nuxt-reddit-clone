import { getAppwriteServer } from '../utils/appwrite-server'

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readBody(event)
  
  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and name are required'
    })
  }
  
  try {
    const { account } = getAppwriteServer()
    
    // Create user account
    const user = await account.create('unique()', email, password, name)
    
    return {
      success: true,
      user: {
        $id: user.$id,
        email: user.email,
        name: user.name
      }
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Registration failed'
    })
  }
})