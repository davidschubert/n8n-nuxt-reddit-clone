export default defineEventHandler(async (event) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header missing or invalid'
    })
  }
  
  const token = authHeader.substring(7)
  
  // Mock token validation - in real app, verify JWT token
  if (!token.startsWith('mock-jwt-token-')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
  
  // Mock user data - in real app, decode token and fetch user from database
  const user = {
    id: 'user-123',
    username: 'testuser',
    email: 'user@example.com',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString()
  }
  
  const session = {
    id: 'session-' + Date.now(),
    userId: user.id,
    token: token,
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    createdAt: new Date().toISOString()
  }
  
  return {
    user,
    session
  }
})