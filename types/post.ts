export interface Post {
  $id?: string
  title: string
  content: string
  authorId: string
  $createdAt?: string
  $updatedAt?: string
  upvotes: number
  downvotes: number
  commentCount: number
  tags: string[]
  images: string[]
  isPublished: boolean
}

export interface CreatePostRequest {
  title: string
  content: string
  tags?: string[]
  images?: string[]
  isPublished?: boolean
}

export interface UpdatePostRequest {
  title?: string
  content?: string
  tags?: string[]
  images?: string[]
  isPublished?: boolean
}

export interface PostValidationError {
  field: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: PostValidationError[]
}