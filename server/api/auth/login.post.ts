import type { LoginCredentials, AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as LoginCredentials
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation - in real app, validate against database
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }
  
  // Mock user validation - replace with real authentication
  if (body.email === 'user@example.com' && body.password === 'password') {
    const user = {
      id: 'user-123',
      username: 'testuser',
      email: body.email,
      createdAt: new Date().toISOString(),
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
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }
})