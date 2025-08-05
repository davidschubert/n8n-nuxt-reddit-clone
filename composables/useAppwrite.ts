import { Client, Account, Databases, RealtimeResponseEvent } from 'appwrite'

export interface ConnectionState {
  isConnected: boolean
  isReconnecting: boolean
  lastDisconnectTime: Date | null
  connectionAttempts: number
}

export interface RealtimeSubscription {
  id: string
  channels: string[]
  callback: (response: RealtimeResponseEvent<any>) => void
  unsubscribe: () => void
}

export const useAppwrite = () => {
  const config = useRuntimeConfig()
  
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(config.public.appwrite.endpoint)
    .setProject(config.public.appwrite.projectId)

  const account = new Account(client)
  const databases = new Databases(client)

  // Connection state management
  const connectionState = ref<ConnectionState>({
    isConnected: false,
    isReconnecting: false,
    lastDisconnectTime: null,
    connectionAttempts: 0
  })

  // Active subscriptions tracking
  const activeSubscriptions = ref<Map<string, RealtimeSubscription>>(new Map())

  // Offline action queue
  const offlineQueue = ref<Array<{ action: string, data: any, timestamp: Date }>>([])

  // Connection management
  const connect = () => {
    connectionState.value.isConnected = true
    connectionState.value.isReconnecting = false
    connectionState.value.connectionAttempts = 0
  }

  const disconnect = () => {
    connectionState.value.isConnected = false
    connectionState.value.lastDisconnectTime = new Date()
  }

  const startReconnecting = () => {
    connectionState.value.isReconnecting = true
    connectionState.value.connectionAttempts++
  }

  // Smart reconnection with exponential backoff
  const reconnect = async () => {
    if (connectionState.value.isReconnecting) return

    startReconnecting()
    
    const maxAttempts = 5
    const baseDelay = 1000 // 1 second
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Try to reconnect by checking account status
        await account.get()
        connect()
        
        // Resubscribe to all active subscriptions
        await resubscribeAll()
        
        // Process offline queue
        await processOfflineQueue()
        
        return
      } catch (error) {
        console.warn(`Reconnection attempt ${attempt} failed:`, error)
        
        if (attempt < maxAttempts) {
          const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    // Failed to reconnect after all attempts
    connectionState.value.isReconnecting = false
    console.error('Failed to reconnect after maximum attempts')
  }

  // Resubscribe to all active subscriptions
  const resubscribeAll = async () => {
    const subscriptions = Array.from(activeSubscriptions.value.values())
    
    for (const subscription of subscriptions) {
      try {
        // Create new subscription with same channels and callback
        const newSubscription = client.subscribe(subscription.channels, subscription.callback)
        
        // Update the subscription with new unsubscribe function
        subscription.unsubscribe = newSubscription
        
      } catch (error) {
        console.error('Failed to resubscribe:', error)
      }
    }
  }

  // Process offline action queue
  const processOfflineQueue = async () => {
    if (!connectionState.value.isConnected) return

    const queue = [...offlineQueue.value]
    offlineQueue.value = []

    for (const queuedAction of queue) {
      try {
        // Process each queued action
        // This would need to be implemented based on specific action types
        console.log('Processing offline action:', queuedAction)
      } catch (error) {
        console.error('Failed to process offline action:', error)
        // Re-queue failed actions
        offlineQueue.value.push(queuedAction)
      }
    }
  }

  // Add action to offline queue when disconnected
  const queueOfflineAction = (action: string, data: any) => {
    if (!connectionState.value.isConnected) {
      offlineQueue.value.push({
        action,
        data,
        timestamp: new Date()
      })
      return true
    }
    return false
  }

  // Generic subscription management
  const subscribe = (channels: string[], callback: (response: RealtimeResponseEvent<any>) => void): string => {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      const unsubscribe = client.subscribe(channels, (response) => {
        // Handle connection events
        if (response.events.includes('realtime.connecting')) {
          disconnect()
          startReconnecting()
        } else if (response.events.includes('realtime.connected')) {
          connect()
        } else if (response.events.includes('realtime.disconnected')) {
          disconnect()
          // Auto-reconnect after a delay
          setTimeout(reconnect, 2000)
        }
        
        // Call the original callback
        callback(response)
      })

      // Store subscription for management
      activeSubscriptions.value.set(subscriptionId, {
        id: subscriptionId,
        channels,
        callback,
        unsubscribe
      })

      return subscriptionId
    } catch (error) {
      console.error('Failed to create subscription:', error)
      throw error
    }
  }

  // Unsubscribe from a specific subscription
  const unsubscribe = (subscriptionId: string) => {
    const subscription = activeSubscriptions.value.get(subscriptionId)
    if (subscription) {
      subscription.unsubscribe()
      activeSubscriptions.value.delete(subscriptionId)
    }
  }

  // Unsubscribe from all subscriptions
  const unsubscribeAll = () => {
    activeSubscriptions.value.forEach(subscription => {
      subscription.unsubscribe()
    })
    activeSubscriptions.value.clear()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribeAll()
  })

  return {
    client,
    account,
    databases,
    connectionState: readonly(connectionState),
    activeSubscriptions: readonly(activeSubscriptions),
    offlineQueue: readonly(offlineQueue),
    subscribe,
    unsubscribe,
    unsubscribeAll,
    queueOfflineAction,
    reconnect
  }
}