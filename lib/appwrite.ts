import { Client, Databases, Account } from 'appwrite'

export const appwriteClient = new Client()

export function initializeAppwrite(endpoint: string, projectId: string) {
  appwriteClient
    .setEndpoint(endpoint)
    .setProject(projectId)
}

export const account = new Account(appwriteClient)
export const databases = new Databases(appwriteClient)