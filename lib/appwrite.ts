import { Client, Databases, Account, Query } from 'appwrite'

/**
 * Appwrite client configuration for the Reddit clone
 */
export class AppwriteService {
  private client: Client
  private databases: Databases
  private account: Account

  constructor() {
    this.client = new Client()
    
    const config = useRuntimeConfig()
    
    this.client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId)

    this.databases = new Databases(this.client)
    this.account = new Account(this.client)
  }

  // Getter methods for accessing services
  getClient() {
    return this.client
  }

  getDatabases() {
    return this.databases
  }

  getAccount() {
    return this.account
  }

  // Database configuration constants
  static readonly DATABASE_ID = process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID || 'reddit-clone-db'
  static readonly COLLECTIONS = {
    COMMENTS: process.env.NUXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || 'comments',
    COMMENT_VOTES: process.env.NUXT_PUBLIC_APPWRITE_COMMENT_VOTES_COLLECTION_ID || 'comment-votes',
    POSTS: process.env.NUXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID || 'posts',
    USERS: process.env.NUXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users'
  }
}

// Export singleton instance
export const appwriteService = new AppwriteService()

// Export the Query helper for building database queries
export { Query }