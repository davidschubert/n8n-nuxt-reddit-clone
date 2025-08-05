import { Client, Account, Databases } from 'appwrite'

let client: Client
let account: Account
let databases: Databases

export function createAppwriteClient() {
  const config = useRuntimeConfig()
  
  if (!client) {
    client = new Client()
    client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProject)
  }
  
  if (!account) {
    account = new Account(client)
  }
  
  if (!databases) {
    databases = new Databases(client)
  }
  
  return {
    client,
    account,
    databases
  }
}

export function getAppwriteClient() {
  return createAppwriteClient()
}