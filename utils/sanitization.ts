// Basic sanitization to prevent XSS attacks
export function sanitizeContent(content: string): string {
  if (!content) return ''
  
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, '') // Remove event handlers (single quotes)
    .trim()
}

export function sanitizeTitle(title: string): string {
  if (!title) return ''
  
  return title
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim()
}

export function sanitizeTags(tags: string[]): string[] {
  if (!Array.isArray(tags)) return []
  
  return tags
    .map(tag => tag.replace(/[<>'"&]/g, '').trim()) // Remove dangerous characters
    .filter(tag => tag.length > 0 && tag.length <= 50) // Filter valid tags
    .slice(0, 10) // Limit to 10 tags
}

export function sanitizeImages(images: string[]): string[] {
  if (!Array.isArray(images)) return []
  
  return images
    .filter(url => {
      try {
        const parsedUrl = new URL(url)
        return ['http:', 'https:'].includes(parsedUrl.protocol)
      } catch {
        return false
      }
    })
    .slice(0, 5) // Limit to 5 images
}