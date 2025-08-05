// Appwrite Configuration
import { Client, Account, Databases, Storage, Functions } from 'appwrite'

// Appwrite Client Setup
const client = new Client()

// Environment Variables (diese werden später aus .env geladen)
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || 'reddit-clone-project'

// Client konfigurieren
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

// Services initialisieren
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const functions = new Functions(client)
// Realtime wird über client.subscribe() verwendet

// Default-IDs für die Datenbank (später konfigurieren)
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'reddit-clone-db'
export const COLLECTIONS = {
  POSTS: process.env.APPWRITE_COLLECTION_POSTS || 'posts',
  COMMENTS: process.env.APPWRITE_COLLECTION_COMMENTS || 'comments',
  VOTES: process.env.APPWRITE_COLLECTION_VOTES || 'votes',
  USERS: process.env.APPWRITE_COLLECTION_USERS || 'users'
} as const

// Storage Bucket IDs
export const BUCKETS = {
  IMAGES: process.env.APPWRITE_BUCKET_IMAGES || 'post-images',
  AVATARS: process.env.APPWRITE_BUCKET_AVATARS || 'user-avatars'
} as const

// Client für Server-Side Nutzung exportieren
export { client }

// Type Definitions für bessere TypeScript-Unterstützung
export interface AppwriteUser {
  $id: string
  name: string
  email: string
  emailVerification: boolean
  phone: string
  phoneVerification: boolean
  prefs: Record<string, any>
  labels: string[]
  accessedAt: string
  registration: string
  status: boolean
}

export interface RedditPost {
  $id?: string
  title: string
  content: string
  author: string
  authorId: string
  subreddit: string
  upvotes: number
  downvotes: number
  score: number
  commentCount: number
  imageUrl?: string
  url?: string
  createdAt: string
  updatedAt: string
}

export interface RedditComment {
  $id?: string
  postId: string
  parentId?: string
  content: string
  author: string
  authorId: string
  upvotes: number
  downvotes: number
  score: number
  depth: number
  createdAt: string
  updatedAt: string
}

export interface RedditVote {
  $id?: string
  userId: string
  targetId: string
  targetType: 'post' | 'comment'
  voteType: 'upvote' | 'downvote'
  createdAt: string
}
