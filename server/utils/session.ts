import type { H3Event } from 'h3'
import jwt from 'jwt-simple'

export interface SessionData {
  userId: string
  email: string
  name: string
  sessionId: string
  expires: number
}

const COOKIE_NAME = 'reddit-session'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
}

export const createSessionCookie = (event: H3Event, sessionData: SessionData): void => {
  const config = useRuntimeConfig()
  const token = jwt.encode(sessionData, config.jwtSecret)
  
  setCookie(event, COOKIE_NAME, token, COOKIE_OPTIONS)
}

export const getSessionFromCookie = (event: H3Event): SessionData | null => {
  try {
    const config = useRuntimeConfig()
    const token = getCookie(event, COOKIE_NAME)
    
    if (!token) return null
    
    const sessionData = jwt.decode(token, config.jwtSecret) as SessionData
    
    // Check if session is expired
    if (sessionData.expires < Date.now()) {
      clearSessionCookie(event)
      return null
    }
    
    return sessionData
  } catch (error) {
    console.error('Session decode error:', error)
    clearSessionCookie(event)
    return null
  }
}

export const clearSessionCookie = (event: H3Event): void => {
  deleteCookie(event, COOKIE_NAME, {
    ...COOKIE_OPTIONS,
    maxAge: 0
  })
}

export const refreshSessionCookie = (event: H3Event, sessionData: SessionData): void => {
  const updatedSession = {
    ...sessionData,
    expires: Date.now() + (COOKIE_OPTIONS.maxAge * 1000)
  }
  createSessionCookie(event, updatedSession)
}