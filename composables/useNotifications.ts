export interface Notification {
  id: string
  type: 'reply' | 'vote' | 'mention'
  title: string
  message: string
  commentId?: string
  postId?: string
  userId: string
  isRead: boolean
  createdAt: Date
}

export const useNotifications = () => {
  const { subscribe, unsubscribe, connectionState } = useAppwrite()
  const config = useRuntimeConfig()

  // Local state
  const notifications = ref<Notification[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
  
  // Subscription tracking
  let notificationSubscriptionId: string | null = null

  // Add notification to local state
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }
    
    notifications.value.unshift(newNotification)
    
    // Show browser notification if supported and permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico'
      })
    }
  }

  // Handle reply notifications
  const handleReplyNotification = (comment: any) => {
    // Check if this is a reply to current user's comment
    if (comment.parentId && comment.userId !== 'current-user-id') {
      addNotification({
        type: 'reply',
        title: 'New Reply',
        message: `Someone replied to your comment`,
        commentId: comment.$id,
        postId: comment.postId,
        userId: comment.userId,
        isRead: false
      })
    }
  }

  // Handle vote notifications
  const handleVoteNotification = (vote: any) => {
    // Notify comment author about votes (optional - can be noisy)
    if (vote.type === 'up') {
      addNotification({
        type: 'vote',
        title: 'Comment Upvoted',
        message: 'Your comment received an upvote',
        commentId: vote.commentId,
        userId: vote.userId,
        isRead: false
      })
    }
  }

  // Subscribe to comment events for notifications
  const subscribeToNotifications = () => {
    if (notificationSubscriptionId) return

    const channels = [
      `databases.${config.public.appwrite.databaseId}.collections.${config.public.appwrite.commentsCollectionId}.documents`,
      `databases.${config.public.appwrite.databaseId}.collections.${config.public.appwrite.votesCollectionId}.documents`
    ]

    notificationSubscriptionId = subscribe(channels, (response) => {
      const { events, payload } = response

      if (events.includes('databases.*.collections.*.documents.*.create')) {
        // Check if this is a comment creation
        if (payload.content) {
          handleReplyNotification(payload)
        }
        // Check if this is a vote creation
        else if (payload.commentId && payload.type) {
          handleVoteNotification(payload)
        }
      }
    })
  }

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
  }

  // Remove notification
  const removeNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Clear all notifications
  const clearAll = () => {
    notifications.value = []
  }

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Initialize notifications
  const initializeNotifications = () => {
    // Request permission on first use
    if ('Notification' in window && Notification.permission === 'default') {
      requestPermission()
    }
    
    subscribeToNotifications()
  }

  // Stop notifications
  const stopNotifications = () => {
    if (notificationSubscriptionId) {
      unsubscribe(notificationSubscriptionId)
      notificationSubscriptionId = null
    }
  }

  // Auto-initialize when online
  watch(connectionState, (state) => {
    if (state.isConnected && !notificationSubscriptionId) {
      subscribeToNotifications()
    }
  })

  // Initialize on mount
  onMounted(() => {
    initializeNotifications()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopNotifications()
  })

  return {
    notifications: readonly(notifications),
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
    initializeNotifications,
    stopNotifications
  }
}