export interface Comment {
  $id: string
  $createdAt: string
  $updatedAt: string
  content: string
  authorId: string
  authorName: string
  postId: string
  parentId?: string | null
  upvotes: number
  downvotes: number
  score: number
  depth: number
  childCount: number
  replies?: Comment[]
}

export interface Vote {
  $id: string
  $createdAt: string
  userId: string
  commentId: string
  type: 'upvote' | 'downvote'
}

export interface CommentCreate {
  content: string
  authorId: string
  authorName: string
  postId: string
  parentId?: string | null
}

export interface CommentSort {
  field: 'createdAt' | 'score' | 'upvotes'
  direction: 'asc' | 'desc'
  label: string
}

export const COMMENT_SORTS: CommentSort[] = [
  { field: 'score', direction: 'desc', label: 'Beliebt' },
  { field: 'createdAt', direction: 'desc', label: 'Neu' },
  { field: 'createdAt', direction: 'asc', label: 'Älteste' }
]