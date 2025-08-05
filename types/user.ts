export interface UserProfile {
  username: string
  avatar: string
  bio: string
  joinDate: Date
  karma: number
  postCount: number
  commentCount: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'post' | 'comment'
  title: string
  content: string
  timestamp: Date
  upvotes: number
  downvotes: number
  subreddit?: string
  postId?: string // for comments
}

export interface Post {
  id: string
  title: string
  content: string
  author: string
  subreddit: string
  timestamp: Date
  upvotes: number
  downvotes: number
  commentCount: number
}

export interface Comment {
  id: string
  content: string
  author: string
  postId: string
  parentId?: string
  timestamp: Date
  upvotes: number
  downvotes: number
}