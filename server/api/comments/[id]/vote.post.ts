import type { VotePayload, VoteResponse, VoteType } from '~/types'

// In-memory storage for demo purposes
// In a real app, this would be a database
const commentsData = new Map<string, {
  score: number
  votes: Map<string, VoteType> // userId -> voteType
}>()

// Rate limiting map: userId -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_MAX = 100 // max votes per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or initialize rate limit
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false // Rate limit exceeded
  }
  
  userLimit.count++
  return true
}

function getCommentData(commentId: string) {
  if (!commentsData.has(commentId)) {
    commentsData.set(commentId, {
      score: 0,
      votes: new Map()
    })
  }
  return commentsData.get(commentId)!
}

function calculateScore(votes: Map<string, VoteType>): number {
  let score = 0
  for (const vote of votes.values()) {
    if (vote === 'upvote') score++
    else if (vote === 'downvote') score--
  }
  return score
}

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const commentId = getRouterParam(event, 'id')
    if (!commentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Comment ID is required'
      })
    }

    const body = await readBody(event) as VotePayload
    
    // Validate payload
    if (!body.voteType || !['upvote', 'downvote', 'remove'].includes(body.voteType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid vote type'
      })
    }

    // Get user ID (in a real app, this would come from authentication)
    const userId = getCookie(event, 'userId') || 'anonymous'
    
    // Check rate limiting
    if (!checkRateLimit(userId)) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Rate limit exceeded. Maximum 100 votes per hour.'
      })
    }

    // Get comment data
    const commentData = getCommentData(commentId)
    
    // Get current user vote
    const currentVote = commentData.votes.get(userId) || null
    
    // Determine new vote
    let newVote: VoteType = null
    if (body.voteType === 'remove') {
      newVote = null
    } else {
      newVote = body.voteType as VoteType
    }
    
    // Update vote
    if (newVote === null) {
      commentData.votes.delete(userId)
    } else {
      commentData.votes.set(userId, newVote)
    }
    
    // Calculate new score
    const newScore = calculateScore(commentData.votes)
    commentData.score = newScore
    
    // Log vote change for monitoring
    console.log(`Vote change: User ${userId} ${newVote || 'removed'} vote on comment ${commentId}. New score: ${newScore}`)
    
    const response: VoteResponse = {
      success: true,
      newScore,
      userVote: newVote
    }
    
    // Set CORS headers for potential real-time updates
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Cache-Control', 'no-cache')
    
    return response
    
  } catch (error) {
    console.error('Vote API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})