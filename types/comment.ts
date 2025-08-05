export interface Comment {
  id: string
  content: string
  author: string
  timestamp: Date
  parentId?: string
  replies: Comment[]
  depth: number
  isCollapsed?: boolean
  likes: number
  isLiked?: boolean
}

export interface CommentProps {
  comment: Comment
  depth: number
  maxDepth?: number
  showReplies?: boolean
}

export interface ThreadProps {
  comments: Comment[]
  postId: string
  maxDepth?: number
}

export interface ReplyFormProps {
  parentId?: string
  onSubmit: (content: string) => void
  onCancel: () => void
  isVisible: boolean
}