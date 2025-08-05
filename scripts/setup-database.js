#!/usr/bin/env node

/**
 * Database Setup Script for Appwrite
 * Creates database, collections, attributes, and indexes for the comment system
 */

const { Client, Databases } = require('appwrite')
const { allCollectionConfigs } = require('../lib/database-config.ts')

class DatabaseSetup {
  constructor() {
    this.client = new Client()
    this.databases = new Databases(this.client)
    
    // Load environment variables
    const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
    const projectId = process.env.APPWRITE_PROJECT_ID
    const apiKey = process.env.APPWRITE_API_KEY
    const databaseId = process.env.APPWRITE_DATABASE_ID || 'reddit-clone-db'
    
    if (!projectId || !apiKey) {
      console.error('❌ Missing required environment variables:')
      console.error('   APPWRITE_PROJECT_ID')
      console.error('   APPWRITE_API_KEY')
      console.error('   Optionally: APPWRITE_ENDPOINT, APPWRITE_DATABASE_ID')
      process.exit(1)
    }
    
    this.client
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey)
    
    this.databaseId = databaseId
  }
  
  async setupDatabase() {
    console.log('🚀 Starting database setup...')
    
    try {
      // Create database if it doesn't exist
      await this.createDatabase()
      
      // Create all collections
      for (const config of allCollectionConfigs) {
        await this.createCollection(config)
      }
      
      console.log('✅ Database setup completed successfully!')
      
    } catch (error) {
      console.error('❌ Database setup failed:', error.message)
      process.exit(1)
    }
  }
  
  async createDatabase() {
    try {
      console.log(`📂 Creating database: ${this.databaseId}`)
      
      await this.databases.create(this.databaseId, 'Reddit Clone Database')
      console.log(`✅ Database created: ${this.databaseId}`)
      
    } catch (error) {
      if (error.code === 409) {
        console.log(`ℹ️  Database already exists: ${this.databaseId}`)
      } else {
        throw error
      }
    }
  }
  
  async createCollection(config) {
    try {
      console.log(`📋 Creating collection: ${config.name}`)
      
      // Create collection
      await this.databases.createCollection(
        this.databaseId,
        config.id,
        config.name,
        config.permissions
      )
      
      console.log(`✅ Collection created: ${config.name}`)
      
      // Create attributes
      for (const attr of config.attributes) {
        await this.createAttribute(config.id, attr)
      }
      
      // Wait a bit for attributes to be ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create indexes
      for (const index of config.indexes) {
        await this.createIndex(config.id, index)
      }
      
    } catch (error) {
      if (error.code === 409) {
        console.log(`ℹ️  Collection already exists: ${config.name}`)
        
        // Still try to create missing attributes and indexes
        for (const attr of config.attributes) {
          try {
            await this.createAttribute(config.id, attr)
          } catch (attrError) {
            if (attrError.code !== 409) {
              console.warn(`⚠️  Failed to create attribute ${attr.key}:`, attrError.message)
            }
          }
        }
        
        for (const index of config.indexes) {
          try {
            await this.createIndex(config.id, index)
          } catch (indexError) {
            if (indexError.code !== 409) {
              console.warn(`⚠️  Failed to create index ${index.key}:`, indexError.message)
            }
          }
        }
      } else {
        throw error
      }
    }
  }
  
  async createAttribute(collectionId, attr) {
    try {
      const methodName = `create${attr.type.charAt(0).toUpperCase() + attr.type.slice(1)}Attribute`
      const method = this.databases[methodName]
      
      if (!method) {
        throw new Error(`Unsupported attribute type: ${attr.type}`)
      }
      
      const params = [this.databaseId, collectionId, attr.key]
      
      // Add size parameter for string attributes
      if (attr.type === 'string' && attr.size) {
        params.push(attr.size)
      }
      
      // Add required parameter
      params.push(attr.required)
      
      // Add default value if specified
      if (attr.default !== undefined) {
        params.push(attr.default)
      }
      
      // Add array parameter if specified
      if (attr.array !== undefined) {
        params.push(attr.array)
      }
      
      await method.apply(this.databases, params)
      console.log(`  ✅ Attribute created: ${attr.key} (${attr.type})`)
      
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ℹ️  Attribute already exists: ${attr.key}`)
      } else {
        console.error(`  ❌ Failed to create attribute ${attr.key}:`, error.message)
        throw error
      }
    }
  }
  
  async createIndex(collectionId, index) {
    try {
      await this.databases.createIndex(
        this.databaseId,
        collectionId,
        index.key,
        index.type,
        index.attributes,
        index.orders
      )
      console.log(`  ✅ Index created: ${index.key} (${index.type})`)
      
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ℹ️  Index already exists: ${index.key}`)
      } else {
        console.error(`  ❌ Failed to create index ${index.key}:`, error.message)
        throw error
      }
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DatabaseSetup()
  setup.setupDatabase()
}

module.exports = { DatabaseSetup }