import { MongoClient, type Db, type MongoClientOptions } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

// In serverless environments (Vercel), don't cache connections
// Each function invocation should create a fresh connection
const shouldCacheConnection = !process.env.VERCEL

export async function connectToDatabase(): Promise<Db> {
  if (shouldCacheConnection && db) {
    return db
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }

  const options: MongoClientOptions = {
    // Connection pool options optimized for serverless (Vercel)
    maxPoolSize: process.env.VERCEL ? 1 : 10,
    // Timeouts optimized for serverless environments
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    // Retry configuration for reliability
    retryWrites: true,
  }

  try {
    // Close existing connection if in serverless mode
    if (process.env.VERCEL && client) {
      try {
        await client.close()
      } catch {
        // Ignore close errors
      }
      client = null
      db = null
    }

    client = new MongoClient(process.env.MONGODB_URI, options)
    await client.connect()
    db = client.db(process.env.MONGODB_DB || "library")
    return db
  } catch (error) {
    // Clean up on error
    if (client) {
      try {
        await client.close()
      } catch {
        // Ignore close errors
      }
      client = null
      db = null
    }
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  if (shouldCacheConnection && db) {
    return db
  }
  return await connectToDatabase()
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
