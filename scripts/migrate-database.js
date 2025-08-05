#!/usr/bin/env node

/**
 * Migration script for existing comment data
 * Handles data migration and schema updates for the comment system
 */

const { Client, Databases, Query } = require('appwrite')

class CommentMigration {
  constructor() {
    this.client = new Client()
    this.databases = new Databases(this.client)
    
    // Load environment variables
    const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
    const projectId = process.env.APPWRITE_PROJECT_ID
    const apiKey = process.env.APPWRITE_API_KEY
    const databaseId = process.env.APPWRITE_DATABASE_ID || 'reddit-clone-db'
    
    if (!projectId || !apiKey) {
      console.error('❌ Missing required environment variables:')
      console.error('   APPWRITE_PROJECT_ID')
      console.error('   APPWRITE_API_KEY')
      process.exit(1)
    }
    
    this.client
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey)
    
    this.databaseId = databaseId
    this.commentsCollection = process.env.APPWRITE_COMMENTS_COLLECTION_ID || 'comments'
    this.votesCollection = process.env.APPWRITE_COMMENT_VOTES_COLLECTION_ID || 'comment-votes'
  }
  
  async runMigration() {
    console.log('🔄 Starting comment data migration...')
    
    try {
      // Migration steps
      await this.migratePaths()
      await this.migrateDepthAndChildCount()
      await this.migrateScores()
      await this.cleanupData()
      
      console.log('✅ Migration completed successfully!')
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message)
      console.error(error)
      process.exit(1)
    }
  }
  
  /**
   * Migrate comment paths for efficient tree queries
   */
  async migratePaths() {
    console.log('📍 Migrating comment paths...')
    
    let offset = 0
    const limit = 100
    let hasMore = true
    
    while (hasMore) {
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.commentsCollection,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderAsc('createdAt')
        ]
      )
      
      if (result.documents.length === 0) {
        hasMore = false
        break
      }
      
      for (const comment of result.documents) {
        if (!comment.path || comment.path === '') {
          const path = await this.calculatePath(comment)
          
          await this.databases.updateDocument(
            this.databaseId,
            this.commentsCollection,
            comment.$id,
            { path }
          )
          
          console.log(`  ✅ Updated path for comment ${comment.$id}: ${path}`)
        }
      }
      
      offset += limit
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  /**
   * Calculate materialized path for a comment
   */
  async calculatePath(comment) {
    if (!comment.parentCommentId || comment.parentCommentId === 'null') {
      return comment.$id
    }
    
    try {
      const parent = await this.databases.getDocument(
        this.databaseId,
        this.commentsCollection,
        comment.parentCommentId
      )
      
      const parentPath = parent.path || await this.calculatePath(parent)
      return `${parentPath}/${comment.$id}`
    } catch (error) {
      console.warn(`⚠️  Could not find parent ${comment.parentCommentId} for comment ${comment.$id}`)
      return comment.$id
    }
  }
  
  /**
   * Migrate depth and child count for performance
   */
  async migrateDepthAndChildCount() {
    console.log('🔢 Migrating depth and child count...')
    
    // First, calculate depth for all comments
    const topLevelComments = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('parentCommentId', 'null'),
        Query.limit(1000)
      ]
    )
    
    for (const comment of topLevelComments.documents) {
      await this.updateDepthRecursively(comment, 0)
    }
    
    // Then, calculate child counts from bottom up
    await this.updateChildCounts()
  }
  
  /**
   * Recursively update depth for comment tree
   */
  async updateDepthRecursively(comment, depth) {
    // Update current comment's depth
    if (comment.depth !== depth) {
      await this.databases.updateDocument(
        this.databaseId,
        this.commentsCollection,
        comment.$id,
        { depth }
      )
      console.log(`  ✅ Updated depth for comment ${comment.$id}: ${depth}`)
    }
    
    // Find children and update their depth
    const children = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('parentCommentId', comment.$id),
        Query.limit(100)
      ]
    )
    
    for (const child of children.documents) {
      await this.updateDepthRecursively(child, depth + 1)
    }
  }
  
  /**
   * Update child counts for all comments
   */
  async updateChildCounts() {
    console.log('👶 Updating child counts...')
    
    let offset = 0
    const limit = 100
    let hasMore = true
    
    while (hasMore) {
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.commentsCollection,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('depth') // Start with deepest comments
        ]
      )
      
      if (result.documents.length === 0) {
        hasMore = false
        break
      }
      
      for (const comment of result.documents) {
        const childCount = await this.calculateChildCount(comment.$id)
        
        if (comment.childCount !== childCount) {
          await this.databases.updateDocument(
            this.databaseId,
            this.commentsCollection,
            comment.$id,
            { childCount }
          )
          console.log(`  ✅ Updated child count for comment ${comment.$id}: ${childCount}`)
        }
      }
      
      offset += limit
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  /**
   * Calculate total child count (direct + indirect children)
   */
  async calculateChildCount(commentId) {
    const directChildren = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('parentCommentId', commentId),
        Query.limit(1000)
      ]
    )
    
    let totalCount = directChildren.documents.length
    
    // Add indirect children
    for (const child of directChildren.documents) {
      totalCount += await this.calculateChildCount(child.$id)
    }
    
    return totalCount
  }
  
  /**
   * Migrate comment scores based on vote counts
   */
  async migrateScores() {
    console.log('📊 Migrating comment scores...')
    
    let offset = 0
    const limit = 100
    let hasMore = true
    
    while (hasMore) {
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.commentsCollection,
        [
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      
      if (result.documents.length === 0) {
        hasMore = false
        break
      }
      
      for (const comment of result.documents) {
        const score = (comment.upvotes || 0) - (comment.downvotes || 0)
        
        if (comment.score !== score) {
          await this.databases.updateDocument(
            this.databaseId,
            this.commentsCollection,
            comment.$id,
            { score }
          )
          console.log(`  ✅ Updated score for comment ${comment.$id}: ${score}`)
        }
      }
      
      offset += limit
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  /**
   * Clean up any inconsistent data
   */
  async cleanupData() {
    console.log('🧹 Cleaning up data...')
    
    // Fix null parentCommentId values
    const nullParents = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.isNull('parentCommentId'),
        Query.limit(1000)
      ]
    )
    
    for (const comment of nullParents.documents) {
      await this.databases.updateDocument(
        this.databaseId,
        this.commentsCollection,
        comment.$id,
        { parentCommentId: 'null' }
      )
      console.log(`  ✅ Fixed null parentCommentId for comment ${comment.$id}`)
    }
    
    // Ensure all comments have required timestamps
    const missingTimestamps = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.limit(1000)
      ]
    )
    
    for (const comment of missingTimestamps.documents) {
      const updates = {}
      
      if (!comment.createdAt) {
        updates.createdAt = comment.$createdAt || new Date()
      }
      
      if (!comment.updatedAt) {
        updates.updatedAt = comment.$updatedAt || comment.createdAt || new Date()
      }
      
      if (Object.keys(updates).length > 0) {
        await this.databases.updateDocument(
          this.databaseId,
          this.commentsCollection,
          comment.$id,
          updates
        )
        console.log(`  ✅ Fixed timestamps for comment ${comment.$id}`)
      }
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new CommentMigration()
  migration.runMigration()
}

module.exports = { CommentMigration }