import { Client, Account, Databases, ID } from 'appwrite'

// Server-side Appwrite configuration
export const createServerAppwriteClient = (sessionCookie?: string) => {
  const config = useRuntimeConfig()
  
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)

  if (sessionCookie) {
    client.setSession(sessionCookie)
  }

  const account = new Account(client)
  const databases = new Databases(client)

  return {
    client,
    account,
    databases,
    ID
  }
}