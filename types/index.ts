export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  persistent?: boolean
}

export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

export interface ErrorState {
  hasError: boolean
  error?: Error | string
  retry?: () => void
  code?: string
}

export interface UXState {
  loading: LoadingState
  error: ErrorState
  toasts: ToastMessage[]
}

export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  upvotes: number
  downvotes: number
  comments: number
  imageUrl?: string
  tags?: string[]
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  reputation: number
  joinedAt: string
}

export interface Comment {
  id: string
  postId: string
  content: string
  author: string
  createdAt: string
  upvotes: number
  downvotes: number
  parentId?: string
  replies?: Comment[]
}