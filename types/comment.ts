export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  score: number
  upvotes: number
  downvotes: number
  createdAt: Date
  updatedAt: Date
  parentId?: string
  replies?: Comment[]
}

export interface CommentSortOptions {
  sortBy: 'popular' | 'new' | 'old' | 'controversial'
  order: 'asc' | 'desc'
}

export type CommentSortType = 'popular' | 'new' | 'old' | 'controversial'

export interface CommentFilters {
  sortBy: CommentSortType
  order: 'asc' | 'desc'
}