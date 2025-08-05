export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  session: Session | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  session: Session
}