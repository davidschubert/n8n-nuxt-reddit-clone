import { defineStore } from 'pinia'
import type { VoteType, VoteState, VoteResponse } from '~/types'

export const useVoteStore = defineStore('vote', {
  state: (): VoteState => ({
    votes: {},
    scores: {},
    isLoading: {}
  }),

  getters: {
    getVote: (state) => (commentId: string): VoteType => {
      return state.votes[commentId] || null
    },
    
    getScore: (state) => (commentId: string): number => {
      return state.scores[commentId] || 0
    },
    
    isVoteLoading: (state) => (commentId: string): boolean => {
      return state.isLoading[commentId] || false
    }
  },

  actions: {
    // Optimistic UI update
    updateVoteOptimistic(commentId: string, voteType: VoteType, currentScore: number) {
      const currentVote = this.votes[commentId] || null
      let newScore = currentScore
      
      // Calculate score change
      if (currentVote === 'upvote' && voteType === 'downvote') {
        newScore -= 2 // Remove upvote (+1) and add downvote (-1)
      } else if (currentVote === 'downvote' && voteType === 'upvote') {
        newScore += 2 // Remove downvote (-1) and add upvote (+1)
      } else if (currentVote === 'upvote' && voteType === null) {
        newScore -= 1 // Remove upvote
      } else if (currentVote === 'downvote' && voteType === null) {
        newScore += 1 // Remove downvote
      } else if (currentVote === null && voteType === 'upvote') {
        newScore += 1 // Add upvote
      } else if (currentVote === null && voteType === 'downvote') {
        newScore -= 1 // Add downvote
      }
      
      this.votes[commentId] = voteType
      this.scores[commentId] = newScore
    },

    // Revert optimistic update if API call fails
    revertVoteOptimistic(commentId: string, originalVote: VoteType, originalScore: number) {
      this.votes[commentId] = originalVote
      this.scores[commentId] = originalScore
    },

    async vote(commentId: string, voteType: 'upvote' | 'downvote') {
      if (this.isLoading[commentId]) return

      const currentVote = this.votes[commentId] || null
      const currentScore = this.scores[commentId] || 0
      
      // Determine new vote type (toggle if same, set if different)
      const newVoteType: VoteType = currentVote === voteType ? null : voteType
      
      // Store original values for potential rollback
      const originalVote = currentVote
      const originalScore = currentScore
      
      try {
        // Set loading state
        this.isLoading[commentId] = true
        
        // Optimistic update
        this.updateVoteOptimistic(commentId, newVoteType, currentScore)
        
        // API call
        const payload = {
          voteType: newVoteType === null ? 'remove' : newVoteType
        }
        
        const response = await $fetch<VoteResponse>(`/api/comments/${commentId}/vote`, {
          method: 'POST',
          body: payload
        })
        
        if (response.success) {
          // Update with server response
          this.votes[commentId] = response.userVote
          this.scores[commentId] = response.newScore
        } else {
          // Revert on failure
          this.revertVoteOptimistic(commentId, originalVote, originalScore)
        }
      } catch (error) {
        console.error('Vote failed:', error)
        // Revert optimistic update
        this.revertVoteOptimistic(commentId, originalVote, originalScore)
      } finally {
        this.isLoading[commentId] = false
      }
    },

    // Initialize vote state for a comment
    initializeComment(commentId: string, score: number, userVote: VoteType) {
      this.scores[commentId] = score
      this.votes[commentId] = userVote
    },

    // Batch update votes (for real-time updates)
    updateVotes(updates: Array<{ commentId: string; score: number; userVote: VoteType }>) {
      updates.forEach(({ commentId, score, userVote }) => {
        this.scores[commentId] = score
        this.votes[commentId] = userVote
      })
    }
  }
})