#!/usr/bin/env node
/**
 * Appwrite Database Setup Script
 * 
 * Dieses Script erstellt automatisch:
 * - Database
 * - Collections (Posts, Comments, Votes, Users)
 * - Attributes für jede Collection
 * - Indexes für Performance
 * - Storage Buckets
 * - Permissions
 */

import { Client, Databases, Storage, Permission, Role } from 'appwrite'

// Konfiguration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || ''
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || ''

const DATABASE_ID = 'reddit-clone-db'
const COLLECTIONS = {
  POSTS: 'posts',
  COMMENTS: 'comments', 
  VOTES: 'votes',
  USERS: 'users'
}
const BUCKETS = {
  IMAGES: 'post-images',
  AVATARS: 'user-avatars'
}

// Client Setup
const client = new Client()
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY)

const databases = new Databases(client)
const storage = new Storage(client)

async function createDatabase() {
  try {
    console.log('📦 Erstelle Database...')
    await databases.create(DATABASE_ID, 'Reddit Clone Database')
    console.log('✅ Database erstellt')
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Database existiert bereits')
    } else {
      throw error
    }
  }
}

async function createPostsCollection() {
  try {
    console.log('📝 Erstelle Posts Collection...')
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      'Posts',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    )

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'title', 255, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'content', 10000, false)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'author', 100, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'authorId', 50, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'subreddit', 50, true)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'upvotes', false, 0)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'downvotes', false, 0)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'score', false, 0)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'commentCount', false, 0)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'imageUrl', 500, false)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.POSTS, 'url', 500, false)

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.POSTS, 'score_index', 'key', ['score'], ['desc'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.POSTS, 'created_index', 'key', ['$createdAt'], ['desc'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.POSTS, 'author_index', 'key', ['authorId'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.POSTS, 'subreddit_index', 'key', ['subreddit'])

    console.log('✅ Posts Collection erstellt')
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Posts Collection existiert bereits')
    } else {
      throw error
    }
  }
}

async function createCommentsCollection() {
  try {
    console.log('💬 Erstelle Comments Collection...')
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.COMMENTS,
      'Comments',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    )

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'postId', 50, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'parentId', 50, false)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'content', 5000, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'author', 100, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'authorId', 50, true)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'upvotes', false, 0)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'downvotes', false, 0)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'score', false, 0)
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'depth', false, 0)

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.COMMENTS, 'post_comments_index', 'key', ['postId'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.COMMENTS, 'parent_comments_index', 'key', ['parentId'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.COMMENTS, 'score_index', 'key', ['score'], ['desc'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.COMMENTS, 'author_index', 'key', ['authorId'])

    console.log('✅ Comments Collection erstellt')
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Comments Collection existiert bereits')
    } else {
      throw error
    }
  }
}

async function createVotesCollection() {
  try {
    console.log('👍 Erstelle Votes Collection...')
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.VOTES,
      'Votes',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    )

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.VOTES, 'userId', 50, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.VOTES, 'targetId', 50, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.VOTES, 'targetType', 20, true)
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.VOTES, 'voteType', 20, true)

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.VOTES, 'user_votes_index', 'key', ['userId'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.VOTES, 'target_votes_index', 'key', ['targetId', 'targetType'])
    await databases.createIndex(DATABASE_ID, COLLECTIONS.VOTES, 'unique_vote_index', 'unique', ['userId', 'targetId'])

    console.log('✅ Votes Collection erstellt')
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Votes Collection existiert bereits')
    } else {
      throw error
    }
  }
}

async function createStorageBuckets() {
  try {
    console.log('🗄️  Erstelle Storage Buckets...')
    
    // Images Bucket
    await storage.createBucket(
      BUCKETS.IMAGES,
      'Post Images',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ],
      false, // enabled
      undefined, // maximum file size
      ['jpg', 'jpeg', 'png', 'gif', 'webp'], // allowed file extensions
      'gzip', // compression
      false, // encryption
      false // antivirus
    )

    // Avatars Bucket  
    await storage.createBucket(
      BUCKETS.AVATARS,
      'User Avatars',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ],
      false,
      1024 * 1024, // 1MB max
      ['jpg', 'jpeg', 'png', 'webp'],
      'gzip',
      false,
      false
    )

    console.log('✅ Storage Buckets erstellt')
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Storage Buckets existieren bereits')
    } else {
      throw error
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starte Appwrite Database Setup...\n')

    if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
      throw new Error('❌ APPWRITE_PROJECT_ID und APPWRITE_API_KEY müssen gesetzt sein')
    }

    await createDatabase()
    await createPostsCollection()
    await createCommentsCollection()
    await createVotesCollection()
    await createStorageBuckets()

    console.log('\n🎉 Database Setup erfolgreich abgeschlossen!')
    console.log('\n📋 Nächste Schritte:')
    console.log('1. Überprüfe deine Appwrite Console')
    console.log('2. Konfiguriere deine .env Datei')
    console.log('3. Starte die Nuxt App: npm run dev')

  } catch (error) {
    console.error('❌ Fehler beim Setup:', error.message)
    process.exit(1)
  }
}

main()
