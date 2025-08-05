export interface User {
  id: string
  email: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface SessionResponse {
  authenticated: boolean
  user: User | null
}