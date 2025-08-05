import type { RegisterCredentials, AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as RegisterCredentials
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (!body.username || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username, email, and password are required'
    })
  }
  
  if (body.password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters long'
    })
  }
  
  // Mock email uniqueness check
  if (body.email === 'existing@example.com') {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already exists'
    })
  }
  
  // Create mock user
  const user = {
    id: 'user-' + Date.now(),
    username: body.username,
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
})