import { Client, Account, Databases, Storage } from 'appwrite'

let client: Client | null = null
let account: Account | null = null
let databases: Databases | null = null
let storage: Storage | null = null

export const initAppwrite = () => {
  if (process.client) {
    client = new Client()
    client
      .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
      .setProject('reddit-clone-project') // Your project ID
    
    account = new Account(client)
    databases = new Databases(client)
    storage = new Storage(client)
  }
}

export const getClient = () => {
  if (!client) {
    initAppwrite()
  }
  return client
}

export const getAccount = () => {
  if (!account) {
    initAppwrite()
  }
  return account
}

export const getDatabases = () => {
  if (!databases) {
    initAppwrite()
  }
  return databases
}

export const getStorage = () => {
  if (!storage) {
    initAppwrite()
  }
  return storage
}

export default defineNuxtPlugin(() => {
  initAppwrite()
})