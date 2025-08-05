import { Client, Databases, Query, ID } from 'appwrite'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)

  const databases = new Databases(client)

  return {
    provide: {
      appwrite: {
        client,
        databases,
        Query,
        ID
      }
    }
  }
})