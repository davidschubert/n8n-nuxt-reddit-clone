export interface User {
  id: string
  username: string
  avatar?: string
  email?: string
}

export interface Post {
  id: string
  title: string
  content: string
  author: User
  createdAt: Date
  updatedAt: Date
  votes: number
  commentCount: number
}

export interface Comment {
  id: string
  content: string
  author: User
  postId: string
  parentCommentId?: string
  createdAt: Date
  updatedAt: Date
  votes: number
  replies?: Comment[]
  isEditing?: boolean
}

export interface CommentEditorProps {
  postId: string
  parentCommentId?: string
  initialValue?: string
  onSubmit: (content: string) => void
  onCancel?: () => void
}

export interface CreateCommentPayload {
  content: string
  postId: string
  parentCommentId?: string
}

export interface UpdateCommentPayload {
  content: string
}

export interface CommentDraft {
  postId: string
  parentCommentId?: string
  content: string
  lastSaved: Date
}

export interface MentionUser {
  id: string
  username: string
  avatar?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}