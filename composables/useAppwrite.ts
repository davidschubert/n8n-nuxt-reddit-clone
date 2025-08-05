import { Client, Account, Databases, Storage, Functions } from 'appwrite'

export const createAppwriteClient = () => {
  const config = useRuntimeConfig()
  
  const client = new Client()
  
  try {
    client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId)
  } catch (error) {
    console.error('Failed to initialize Appwrite client:', error)
    throw new Error('Appwrite client initialization failed')
  }

  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const functions = new Functions(client)

  return {
    client,
    account,
    databases,
    storage,
    functions
  }
}

// Client-side composable
export const useAppwrite = () => {
  const appwrite = useState('appwrite', () => createAppwriteClient())
  return appwrite.value
}