import type { UserProfile, Activity, Post, Comment } from '~/types/user'

// Mock data for demonstration
const mockUsers: Record<string, UserProfile> = {
  'john_doe': {
    username: 'john_doe',
    avatar: 'https://i.pravatar.cc/150?u=john_doe',
    bio: 'Full-stack developer passionate about Vue.js and Nuxt. Love discussing web technologies and sharing knowledge with the community.',
    joinDate: new Date('2023-01-15'),
    karma: 2847,
    postCount: 23,
    commentCount: 156,
    recentActivity: []
  },
  'jane_smith': {
    username: 'jane_smith',
    avatar: 'https://i.pravatar.cc/150?u=jane_smith',
    bio: 'UX Designer and occasional coder. Interested in accessibility, design systems, and making the web better for everyone.',
    joinDate: new Date('2023-03-22'),
    karma: 1523,
    postCount: 15,
    commentCount: 89,
    recentActivity: []
  },
  'tech_guru': {
    username: 'tech_guru',
    avatar: 'https://i.pravatar.cc/150?u=tech_guru',
    bio: 'Senior Software Engineer with 10+ years experience. Open source contributor and mentor.',
    joinDate: new Date('2022-11-05'),
    karma: 5420,
    postCount: 45,
    commentCount: 234,
    recentActivity: []
  }
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'post',
    title: 'Getting started with Nuxt 4',
    content: 'Just migrated to Nuxt 4 and loving the new features! Here are my thoughts...',
    timestamp: new Date('2024-01-15T10:30:00'),
    upvotes: 24,
    downvotes: 2,
    subreddit: 'nuxt'
  },
  {
    id: '2',
    type: 'comment',
    title: 'Re: Best practices for Vue composables',
    content: 'Great point! I would also recommend using proper TypeScript types for better DX.',
    timestamp: new Date('2024-01-14T16:45:00'),
    upvotes: 12,
    downvotes: 1,
    subreddit: 'vue',
    postId: 'post_123'
  },
  {
    id: '3',
    type: 'post',
    title: 'Why I switched from React to Vue',
    content: 'After working with React for 3 years, I decided to give Vue a try and...',
    timestamp: new Date('2024-01-12T09:15:00'),
    upvotes: 45,
    downvotes: 8,
    subreddit: 'webdev'
  },
  {
    id: '4',
    type: 'comment',
    title: 'Re: TypeScript tips for beginners',
    content: 'Another great tip is to enable strict mode from day one. It will save you lots of debugging time later.',
    timestamp: new Date('2024-01-10T14:20:00'),
    upvotes: 18,
    downvotes: 0,
    subreddit: 'typescript',
    postId: 'post_456'
  }
]

// Initialize mock data with activities
Object.keys(mockUsers).forEach((username, index) => {
  mockUsers[username].recentActivity = mockActivities.slice(index, index + 3)
})

export const useUserData = () => {
  
  const getUserProfile = async (username: string): Promise<UserProfile | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user = mockUsers[username.toLowerCase()]
    if (!user) return null
    
    return {
      ...user,
      recentActivity: [...user.recentActivity].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }
  }

  const getUserActivities = async (
    username: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ activities: Activity[], hasMore: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const user = mockUsers[username.toLowerCase()]
    if (!user) return { activities: [], hasMore: false }
    
    const allActivities = [...mockActivities]
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      activities: allActivities.slice(startIndex, endIndex),
      hasMore: endIndex < allActivities.length
    }
  }

  const calculateKarma = (activities: Activity[]): number => {
    return activities.reduce((total, activity) => {
      return total + (activity.upvotes - activity.downvotes)
    }, 0)
  }

  return {
    getUserProfile,
    getUserActivities,
    calculateKarma
  }
}