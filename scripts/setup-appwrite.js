#!/usr/bin/env node

/**
 * Appwrite Setup Script
 * 
 * This script helps set up the Appwrite database and collection for posts.
 * Run this script after setting up your Appwrite project and configuring environment variables.
 * 
 * Usage: node scripts/setup-appwrite.js
 */

const { Client, Databases, Permission, Role } = require('appwrite')

const COLLECTION_SCHEMA = {
  name: 'posts',
  documentSecurity: true,
  permissions: [
    Permission.create(Role.any()),
    Permission.read(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any())
  ],
  attributes: [
    {
      key: 'title',
      type: 'string',
      size: 200,
      required: true
    },
    {
      key: 'content',
      type: 'string',
      size: 10000,
      required: true
    },
    {
      key: 'authorId',
      type: 'string',
      size: 100,
      required: true
    },
    {
      key: 'upvotes',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'downvotes',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'commentCount',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'tags',
      type: 'string',
      size: 500,
      array: true,
      required: false
    },
    {
      key: 'images',
      type: 'url',
      array: true,
      required: false
    },
    {
      key: 'isPublished',
      type: 'boolean',
      required: true,
      default: true
    }
  ],
  indexes: [
    {
      key: 'idx_created_at',
      type: 'key',
      attributes: ['$createdAt'],
      orders: ['desc']
    },
    {
      key: 'idx_author',
      type: 'key',
      attributes: ['authorId']
    },
    {
      key: 'idx_published',
      type: 'key',
      attributes: ['isPublished']
    }
  ]
}

async function setupAppwrite() {
  // Load environment variables
  require('dotenv').config()

  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    APPWRITE_DATABASE_ID,
    APPWRITE_POSTS_COLLECTION_ID
  } = process.env

  if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !APPWRITE_DATABASE_ID) {
    console.error('Missing required environment variables. Please check your .env file.')
    process.exit(1)
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY)

  const databases = new Databases(client)

  try {
    console.log('Setting up Appwrite collection for posts...')

    // Create collection
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      APPWRITE_POSTS_COLLECTION_ID || 'posts',
      COLLECTION_SCHEMA.name,
      COLLECTION_SCHEMA.permissions,
      COLLECTION_SCHEMA.documentSecurity
    )

    console.log(`✓ Collection created: ${collection.name} (${collection.$id})`)

    // Create attributes
    for (const attr of COLLECTION_SCHEMA.attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            APPWRITE_DATABASE_ID,
            collection.$id,
            attr.key,
            attr.size,
            attr.required,
            attr.default,
            attr.array
          )
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            APPWRITE_DATABASE_ID,
            collection.$id,
            attr.key,
            attr.required,
            attr.min,
            attr.max,
            attr.default,
            attr.array
          )
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            APPWRITE_DATABASE_ID,
            collection.$id,
            attr.key,
            attr.required,
            attr.default,
            attr.array
          )
        } else if (attr.type === 'url') {
          await databases.createUrlAttribute(
            APPWRITE_DATABASE_ID,
            collection.$id,
            attr.key,
            attr.required,
            attr.default,
            attr.array
          )
        }

        console.log(`✓ Attribute created: ${attr.key}`)
      } catch (error) {
        console.warn(`⚠ Attribute ${attr.key} might already exist:`, error.message)
      }
    }

    // Create indexes
    for (const index of COLLECTION_SCHEMA.indexes) {
      try {
        await databases.createIndex(
          APPWRITE_DATABASE_ID,
          collection.$id,
          index.key,
          index.type,
          index.attributes,
          index.orders
        )
        console.log(`✓ Index created: ${index.key}`)
      } catch (error) {
        console.warn(`⚠ Index ${index.key} might already exist:`, error.message)
      }
    }

    console.log('\n✅ Appwrite setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Start your Nuxt.js application: npm run dev')
    console.log('2. Navigate to /create-post to create your first post')

  } catch (error) {
    console.error('❌ Error setting up Appwrite:', error.message)
    process.exit(1)
  }
}

setupAppwrite()