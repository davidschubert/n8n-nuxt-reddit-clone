import type { AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (!body.refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Refresh token is required'
    })
  }
  
  // Mock refresh token validation
  if (!body.refreshToken.startsWith('mock-refresh-token-')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid refresh token'
    })
  }
  
  // Generate new tokens
  const user = {
    id: 'user-123',
    username: 'testuser',
    email: 'user@example.com',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  const session = {
    id: 'session-' + Date.now(),
    userId: user.id,
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    createdAt: new Date().toISOString()
  }
  
  const response: AuthResponse = {
    user,
    session
  }
  
  return response
})