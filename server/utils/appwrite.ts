import { Client, Account, Databases, Storage, Functions, Users } from 'node-appwrite'

let serverAppwriteClient: ReturnType<typeof createServerAppwriteClient> | null = null

export const createServerAppwriteClient = () => {
  const config = useRuntimeConfig()
  
  const client = new Client()
  
  try {
    client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId)
      .setKey(config.appwriteApiKey)
  } catch (error) {
    console.error('Failed to initialize Appwrite server client:', error)
    throw new Error('Appwrite server client initialization failed')
  }

  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const functions = new Functions(client)
  const users = new Users(client)

  return {
    client,
    account,
    databases,
    storage,
    functions,
    users
  }
}

// Server-side singleton instance
export const getServerAppwrite = () => {
  if (!serverAppwriteClient) {
    serverAppwriteClient = createServerAppwriteClient()
  }
  return serverAppwriteClient
}

// Health check function
export const checkAppwriteConnection = async () => {
  try {
    const { client } = getServerAppwrite()
    // Simple health check - try to get project info
    const health = await client.call('GET', '/health', {}, {})
    return { status: 'connected', health }
  } catch (error) {
    console.error('Appwrite connection check failed:', error)
    return { 
      status: 'disconnected', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}