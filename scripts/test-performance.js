#!/usr/bin/env node

/**
 * Performance test script for the comment system
 * Tests deep nesting, bulk operations, and query performance
 */

const { Client, Databases, ID, Query } = require('appwrite')

class CommentPerformanceTest {
  constructor() {
    this.client = new Client()
    this.databases = new Databases(this.client)
    
    // Load environment variables
    const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
    const projectId = process.env.APPWRITE_PROJECT_ID
    const apiKey = process.env.APPWRITE_API_KEY
    const databaseId = process.env.APPWRITE_DATABASE_ID || 'reddit-clone-db'
    
    if (!projectId || !apiKey) {
      console.error('❌ Missing required environment variables for testing')
      process.exit(1)
    }
    
    this.client
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey)
    
    this.databaseId = databaseId
    this.commentsCollection = process.env.APPWRITE_COMMENTS_COLLECTION_ID || 'comments'
    this.votesCollection = process.env.APPWRITE_COMMENT_VOTES_COLLECTION_ID || 'comment-votes'
    
    // Test data
    this.testPostId = 'test-post-' + Date.now()
    this.testUserId = 'test-user-' + Date.now()
    this.testCommentIds = []
  }
  
  async runPerformanceTests() {
    console.log('🚀 Starting comment system performance tests...')
    
    try {
      // Test deep nesting performance
      await this.testDeepNesting()
      
      // Test bulk comment creation
      await this.testBulkOperations()
      
      // Test query performance
      await this.testQueryPerformance()
      
      // Test voting performance
      await this.testVotingPerformance()
      
      // Cleanup test data
      await this.cleanup()
      
      console.log('✅ All performance tests completed successfully!')
      
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message)
      console.error(error)
      
      // Attempt cleanup even on failure
      await this.cleanup()
      process.exit(1)
    }
  }
  
  /**
   * Test deep comment nesting performance
   */
  async testDeepNesting() {
    console.log('🔄 Testing deep comment nesting...')
    
    const maxDepth = 10
    let parentCommentId = null
    const startTime = Date.now()
    
    for (let depth = 0; depth < maxDepth; depth++) {
      const commentId = ID.unique()
      
      const commentData = {
        content: `Test comment at depth ${depth}`,
        authorId: this.testUserId,
        postId: this.testPostId,
        parentCommentId: parentCommentId,
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: Math.floor(Math.random() * 100),
        downvotes: Math.floor(Math.random() * 20),
        depth: depth,
        childCount: 0,
        isDeleted: false,
        path: parentCommentId ? `parent-path/${commentId}` : commentId,
        score: Math.floor(Math.random() * 80)
      }
      
      await this.databases.createDocument(
        this.databaseId,
        this.commentsCollection,
        commentId,
        commentData
      )
      
      this.testCommentIds.push(commentId)
      parentCommentId = commentId
      
      // Update parent child count
      if (depth > 0) {
        const parentId = this.testCommentIds[depth - 1]
        const parent = await this.databases.getDocument(
          this.databaseId,
          this.commentsCollection,
          parentId
        )
        
        await this.databases.updateDocument(
          this.databaseId,
          this.commentsCollection,
          parentId,
          {
            childCount: parent.childCount + 1
          }
        )
      }
    }
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`  ✅ Created ${maxDepth} nested comments in ${duration}ms`)
    console.log(`  📊 Average time per comment: ${(duration / maxDepth).toFixed(2)}ms`)
  }
  
  /**
   * Test bulk comment operations
   */
  async testBulkOperations() {
    console.log('🔄 Testing bulk comment operations...')
    
    const batchSize = 50
    const startTime = Date.now()
    
    // Create bulk comments
    const promises = []
    for (let i = 0; i < batchSize; i++) {
      const commentId = ID.unique()
      
      const commentData = {
        content: `Bulk comment ${i + 1}`,
        authorId: this.testUserId,
        postId: this.testPostId,
        parentCommentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: Math.floor(Math.random() * 50),
        downvotes: Math.floor(Math.random() * 10),
        depth: 0,
        childCount: 0,
        isDeleted: false,
        path: commentId,
        score: Math.floor(Math.random() * 40)
      }
      
      promises.push(
        this.databases.createDocument(
          this.databaseId,
          this.commentsCollection,
          commentId,
          commentData
        )
      )
      
      this.testCommentIds.push(commentId)
    }
    
    await Promise.all(promises)
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`  ✅ Created ${batchSize} comments in parallel in ${duration}ms`)
    console.log(`  📊 Average time per comment: ${(duration / batchSize).toFixed(2)}ms`)
  }
  
  /**
   * Test query performance for different scenarios
   */
  async testQueryPerformance() {
    console.log('🔄 Testing query performance...')
    
    // Test 1: Get top-level comments by score
    let startTime = Date.now()
    const topComments = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('postId', this.testPostId),
        Query.equal('parentCommentId', 'null'),
        Query.orderDesc('score'),
        Query.limit(20)
      ]
    )
    let endTime = Date.now()
    
    console.log(`  ✅ Top-level comments query: ${endTime - startTime}ms (${topComments.documents.length} results)`)
    
    // Test 2: Get comments by author
    startTime = Date.now()
    const authorComments = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('authorId', this.testUserId),
        Query.orderDesc('createdAt'),
        Query.limit(20)
      ]
    )
    endTime = Date.now()
    
    console.log(`  ✅ Author comments query: ${endTime - startTime}ms (${authorComments.documents.length} results)`)
    
    // Test 3: Get comments within depth range
    startTime = Date.now()
    const depthComments = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('postId', this.testPostId),
        Query.lessThanEqual('depth', 3),
        Query.orderDesc('score'),
        Query.limit(20)
      ]
    )
    endTime = Date.now()
    
    console.log(`  ✅ Depth-limited query: ${endTime - startTime}ms (${depthComments.documents.length} results)`)
    
    // Test 4: Full-text search
    startTime = Date.now()
    const searchComments = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.search('content', 'Test'),
        Query.equal('postId', this.testPostId),
        Query.limit(20)
      ]
    )
    endTime = Date.now()
    
    console.log(`  ✅ Full-text search query: ${endTime - startTime}ms (${searchComments.documents.length} results)`)
  }
  
  /**
   * Test voting system performance
   */
  async testVotingPerformance() {
    console.log('🔄 Testing voting performance...')
    
    if (this.testCommentIds.length === 0) return
    
    const voteBatchSize = 20
    const startTime = Date.now()
    
    // Create bulk votes
    const votePromises = []
    for (let i = 0; i < voteBatchSize; i++) {
      const voteId = ID.unique()
      const commentId = this.testCommentIds[i % this.testCommentIds.length]
      const voteType = Math.random() > 0.5 ? 'upvote' : 'downvote'
      
      const voteData = {
        commentId: commentId,
        userId: `test-voter-${i}`,
        voteType: voteType,
        createdAt: new Date()
      }
      
      votePromises.push(
        this.databases.createDocument(
          this.databaseId,
          this.votesCollection,
          voteId,
          voteData
        )
      )
    }
    
    await Promise.all(votePromises)
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`  ✅ Created ${voteBatchSize} votes in parallel in ${duration}ms`)
    console.log(`  📊 Average time per vote: ${(duration / voteBatchSize).toFixed(2)}ms`)
    
    // Test vote queries
    const queryStartTime = Date.now()
    const commentVotes = await this.databases.listDocuments(
      this.databaseId,
      this.votesCollection,
      [
        Query.equal('commentId', this.testCommentIds[0]),
        Query.limit(50)
      ]
    )
    const queryEndTime = Date.now()
    
    console.log(`  ✅ Vote query performance: ${queryEndTime - queryStartTime}ms (${commentVotes.documents.length} votes)`)
  }
  
  /**
   * Clean up test data
   */
  async cleanup() {
    console.log('🧹 Cleaning up test data...')
    
    try {
      // Delete test comments
      for (const commentId of this.testCommentIds) {
        try {
          await this.databases.deleteDocument(
            this.databaseId,
            this.commentsCollection,
            commentId
          )
        } catch (error) {
          // Ignore if already deleted
        }
      }
      
      // Delete test votes
      const testVotes = await this.databases.listDocuments(
        this.databaseId,
        this.votesCollection,
        [
          Query.startsWith('userId', 'test-'),
          Query.limit(1000)
        ]
      )
      
      for (const vote of testVotes.documents) {
        try {
          await this.databases.deleteDocument(
            this.databaseId,
            this.votesCollection,
            vote.$id
          )
        } catch (error) {
          // Ignore if already deleted
        }
      }
      
      console.log('  ✅ Test data cleaned up')
      
    } catch (error) {
      console.warn('⚠️  Some test data may not have been cleaned up:', error.message)
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const test = new CommentPerformanceTest()
  test.runPerformanceTests()
}

module.exports = { CommentPerformanceTest }