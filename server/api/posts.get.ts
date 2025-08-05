import type { Post, PostsResponse, PostsQuery } from '~/types/posts'

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to the Reddit Clone!',
    content: 'This is our first post in the new Reddit-style platform.',
    author: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    votes: 42,
    commentsCount: 8,
    tags: ['welcome', 'announcement'],
    category: 'general',
    thumbnail: 'https://picsum.photos/200/150?random=1'
  },
  {
    id: '2',
    title: 'SSR with Nuxt 4 is Amazing!',
    content: 'Server-side rendering provides excellent performance and SEO benefits.',
    author: 'developer',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
    votes: 35,
    commentsCount: 12,
    tags: ['nuxt', 'ssr', 'performance'],
    category: 'technology',
    thumbnail: 'https://picsum.photos/200/150?random=2'
  },
  {
    id: '3',
    title: 'Tips for Better Web Performance',
    content: 'Learn how to optimize your web applications for better Core Web Vitals.',
    author: 'webdev',
    createdAt: '2024-01-15T08:45:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    votes: 28,
    commentsCount: 6,
    tags: ['performance', 'optimization', 'web'],
    category: 'technology',
    thumbnail: 'https://picsum.photos/200/150?random=3'
  },
  {
    id: '4',
    title: 'Vue 3 Best Practices',
    content: 'Discover the best practices for developing with Vue 3 and Composition API.',
    author: 'vueguru',
    createdAt: '2024-01-15T07:20:00Z',
    updatedAt: '2024-01-15T07:20:00Z',
    votes: 51,
    commentsCount: 15,
    tags: ['vue', 'composition-api', 'best-practices'],
    category: 'technology',
    thumbnail: 'https://picsum.photos/200/150?random=4'
  },
  {
    id: '5',
    title: 'Discussion: Future of Web Development',
    content: 'What do you think the future holds for web development?',
    author: 'futurist',
    createdAt: '2024-01-15T06:15:00Z',
    updatedAt: '2024-01-15T06:15:00Z',
    votes: 19,
    commentsCount: 23,
    tags: ['discussion', 'future', 'web-development'],
    category: 'general',
    thumbnail: 'https://picsum.photos/200/150?random=5'
  }
]

export default defineEventHandler(async (event): Promise<PostsResponse> => {
  const query = getQuery(event) as PostsQuery
  
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const sort = query.sort || 'hot'
  const category = query.category
  const tags = query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : []
  const search = query.search
  
  let filteredPosts = [...mockPosts]
  
  // Filter by category
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category)
  }
  
  // Filter by tags
  if (tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      tags.some(tag => post.tags.includes(tag))
    )
  }
  
  // Filter by search
  if (search) {
    const searchTerm = search.toLowerCase()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  // Sort posts
  switch (sort) {
    case 'new':
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'top':
      filteredPosts.sort((a, b) => b.votes - a.votes)
      break
    case 'hot':
    default:
      // Hot sorting combines votes and recency
      filteredPosts.sort((a, b) => {
        const aScore = a.votes * Math.exp(-(Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        const bScore = b.votes * Math.exp(-(Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        return bScore - aScore
      })
      break
  }
  
  const total = filteredPosts.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const posts = filteredPosts.slice(offset, offset + limit)
  
  // Simulate network delay for realistic experience
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    posts,
    total,
    page,
    limit,
    totalPages
  }
})