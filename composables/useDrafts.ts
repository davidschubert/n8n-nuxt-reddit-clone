import type { CommentDraft } from '~/types'

/**
 * Composable for managing comment drafts in localStorage
 */
export const useDrafts = () => {
  const DRAFT_KEY = 'comment-drafts'
  const AUTO_SAVE_INTERVAL = 3000 // 3 seconds

  /**
   * Get draft key for a specific comment context
   */
  const getDraftKey = (postId: string, parentCommentId?: string): string => {
    return parentCommentId ? `${postId}-${parentCommentId}` : postId
  }

  /**
   * Load all drafts from localStorage
   */
  const loadDrafts = (): Record<string, CommentDraft> => {
    if (import.meta.client) {
      try {
        const drafts = localStorage.getItem(DRAFT_KEY)
        return drafts ? JSON.parse(drafts) : {}
      } catch (error) {
        console.error('Error loading drafts:', error)
        return {}
      }
    }
    return {}
  }

  /**
   * Save drafts to localStorage
   */
  const saveDrafts = (drafts: Record<string, CommentDraft>) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts))
      } catch (error) {
        console.error('Error saving drafts:', error)
      }
    }
  }

  /**
   * Get draft for specific context
   */
  const getDraft = (postId: string, parentCommentId?: string): CommentDraft | null => {
    const drafts = loadDrafts()
    const key = getDraftKey(postId, parentCommentId)
    return drafts[key] || null
  }

  /**
   * Save draft for specific context
   */
  const saveDraft = (postId: string, content: string, parentCommentId?: string) => {
    if (!content.trim()) {
      removeDraft(postId, parentCommentId)
      return
    }

    const drafts = loadDrafts()
    const key = getDraftKey(postId, parentCommentId)
    
    drafts[key] = {
      postId,
      parentCommentId,
      content,
      lastSaved: new Date()
    }
    
    saveDrafts(drafts)
  }

  /**
   * Remove draft for specific context
   */
  const removeDraft = (postId: string, parentCommentId?: string) => {
    const drafts = loadDrafts()
    const key = getDraftKey(postId, parentCommentId)
    delete drafts[key]
    saveDrafts(drafts)
  }

  /**
   * Auto-save draft with debouncing
   */
  const createAutoSave = (postId: string, parentCommentId?: string) => {
    let timeoutId: NodeJS.Timeout | null = null

    return (content: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        saveDraft(postId, content, parentCommentId)
      }, AUTO_SAVE_INTERVAL)
    }
  }

  /**
   * Clean old drafts (older than 7 days)
   */
  const cleanOldDrafts = () => {
    const drafts = loadDrafts()
    const now = new Date()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

    const cleanedDrafts = Object.fromEntries(
      Object.entries(drafts).filter(([_, draft]) => {
        const draftAge = now.getTime() - new Date(draft.lastSaved).getTime()
        return draftAge < maxAge
      })
    )

    saveDrafts(cleanedDrafts)
  }

  return {
    getDraft,
    saveDraft,
    removeDraft,
    createAutoSave,
    cleanOldDrafts
  }
}