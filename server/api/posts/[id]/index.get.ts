// Sample posts data
const samplePosts = [
  {
    id: '1',
    title: 'Welcome to our Reddit Clone!',
    content: 'This is the first post in our new Reddit clone. Feel free to comment and test the sorting functionality!',
    author: 'admin',
    score: 42,
    upvotes: 45,
    downvotes: 3,
    commentCount: 8,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  }
]

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }

  const post = samplePosts.find(p => p.id === postId)
  
  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }
  
  return post
})