import { Client, Databases } from 'appwrite'

let client: Client | null = null
let databases: Databases | null = null

export function getServerAppwrite(config: any) {
  if (!client) {
    client = new Client()
      .setEndpoint(config.appwriteEndpoint)
      .setProject(config.appwriteProjectId)
      .setKey(config.appwriteApiKey)
    
    databases = new Databases(client)
  }
  
  return { client, databases }
}