import type { Comment, CommentSortType } from '~/types/comment'

export function sortComments(comments: Comment[], sortBy: CommentSortType): Comment[] {
  const sortedComments = [...comments]

  switch (sortBy) {
    case 'popular':
      return sortedComments.sort((a, b) => b.score - a.score)
    
    case 'new':
      return sortedComments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    
    case 'old':
      return sortedComments.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    
    case 'controversial':
      // Sort by highest engagement (upvotes + downvotes) but controversial ratio
      return sortedComments.sort((a, b) => {
        const aEngagement = a.upvotes + a.downvotes
        const bEngagement = b.upvotes + b.downvotes
        
        // If no engagement, sort by score
        if (aEngagement === 0 && bEngagement === 0) {
          return b.score - a.score
        }
        
        // Calculate controversy score (high engagement, but close up/down ratio)
        const aControversy = aEngagement > 0 ? Math.min(a.upvotes, a.downvotes) / aEngagement : 0
        const bControversy = bEngagement > 0 ? Math.min(b.upvotes, b.downvotes) / bEngagement : 0
        
        return bControversy - aControversy || bEngagement - aEngagement
      })
    
    default:
      return sortedComments
  }
}

export function getSortDisplayName(sortBy: CommentSortType): string {
  switch (sortBy) {
    case 'popular':
      return 'Beliebt'
    case 'new':
      return 'Neu'
    case 'old':
      return 'Älteste'
    case 'controversial':
      return 'Kontrovers'
    default:
      return 'Beliebt'
  }
}