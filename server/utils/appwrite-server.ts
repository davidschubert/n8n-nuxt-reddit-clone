import { Client, Account, Databases, Users } from 'appwrite'

let client: Client
let account: Account
let databases: Databases
let users: Users

export function createAppwriteServer() {
  const config = useRuntimeConfig()
  
  if (!client) {
    client = new Client()
    client
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProject)
      .setKey(config.appwriteKey)
  }
  
  if (!account) {
    account = new Account(client)
  }
  
  if (!databases) {
    databases = new Databases(client)
  }
  
  if (!users) {
    users = new Users(client)
  }
  
  return {
    client,
    account,
    databases,
    users
  }
}

export function getAppwriteServer() {
  return createAppwriteServer()
}