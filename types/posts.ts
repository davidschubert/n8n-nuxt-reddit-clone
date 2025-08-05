export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  votes: number
  commentsCount: number
  tags: string[]
  category: string
  url?: string
  thumbnail?: string
}

export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type SortOption = 'hot' | 'new' | 'top'

export interface PostsQuery {
  page?: number
  limit?: number
  sort?: SortOption
  category?: string
  tags?: string[]
  search?: string
}