import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked with security settings
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * Safely render markdown to HTML with XSS protection
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''
  
  // First convert markdown to HTML
  const html = marked(content)
  
  // Then sanitize the HTML to prevent XSS
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 
      'a', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  })
}

/**
 * Process @mentions in content and convert them to markdown links
 */
export function processMentions(content: string): string {
  return content.replace(/@(\w+)/g, '[@$1](/user/$1)')
}

/**
 * Extract @mentions from content
 */
export function extractMentions(content: string): string[] {
  const matches = content.match(/@(\w+)/g)
  return matches ? matches.map(match => match.slice(1)) : []
}

/**
 * Validate comment content
 */
export function validateComment(content: string): { isValid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Comment cannot be empty' }
  }
  
  if (content.length > 10000) {
    return { isValid: false, error: 'Comment is too long (max 10,000 characters)' }
  }
  
  return { isValid: true }
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}