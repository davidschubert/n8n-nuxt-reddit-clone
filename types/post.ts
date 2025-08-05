export interface Post {
  id: string
  title: string
  content: string
  author: string
  score: number
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}