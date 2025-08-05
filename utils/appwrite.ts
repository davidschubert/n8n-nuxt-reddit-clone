import { Client, Account, Databases, ID } from 'appwrite'

// Client-side Appwrite configuration
export const createAppwriteClient = () => {
  const config = useRuntimeConfig()
  
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)

  const account = new Account(client)
  const databases = new Databases(client)

  return {
    client,
    account,
    databases,
    ID
  }
}