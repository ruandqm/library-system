import { MongoClient, type Db, type MongoClientOptions } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

const isVercel = !!process.env.VERCEL
const isProduction = process.env.NODE_ENV === "production"

// In serverless environments (Vercel), don't cache connections
// Each function invocation should create a fresh connection
const shouldCacheConnection = !isVercel

/**
 * Normalize MongoDB URI for Vercel/Atlas compatibility
 * Ensures proper TLS configuration in the connection string
 */
function normalizeMongoUri(uri: string): string {
  // If it's already mongodb+srv://, it's correct for Atlas
  if (uri.includes("mongodb+srv://")) {
    return uri
  }

  // If it's mongodb:// with Atlas domain, convert to mongodb+srv://
  if (uri.includes("mongodb.net")) {
    uri = uri.replace("mongodb://", "mongodb+srv://")
  }

  // Ensure retryWrites is enabled for Atlas
  if (uri.includes("mongodb+srv://") && !uri.includes("retryWrites")) {
    const separator = uri.includes("?") ? "&" : "?"
    uri = `${uri}${separator}retryWrites=true&w=majority`
  }

  return uri
}

export async function connectToDatabase(): Promise<Db> {
  // In Vercel/serverless, always create a new connection
  if (shouldCacheConnection && db) {
    return db
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }

  // Normalize URI for Vercel/Atlas compatibility
  const uri = normalizeMongoUri(process.env.MONGODB_URI)
  const isAtlas = uri.includes("mongodb+srv://") || uri.includes("mongodb.net")

  // Configure MongoDB client options
  // For Vercel + MongoDB Atlas, use minimal options and let the URI handle TLS
  const options: MongoClientOptions = {
    // Connection pool options optimized for serverless (Vercel)
    maxPoolSize: isVercel ? 1 : 10,
    minPoolSize: isVercel ? 0 : 1,
    // Timeouts optimized for serverless environments
    serverSelectionTimeoutMS: isVercel ? 30000 : 10000,
    socketTimeoutMS: isVercel ? 60000 : 45000,
    connectTimeoutMS: isVercel ? 30000 : 10000,
    // Retry configuration for reliability
    retryWrites: true,
    retryReads: true,
    // Compression disabled on Vercel to reduce CPU usage
    compressors: isVercel ? [] : ["zlib"],
    // For Atlas, don't override TLS - let the connection string handle it
    // The mongodb+srv:// protocol automatically enables TLS
  }

  try {
    // Close existing connection if in serverless mode
    if (isVercel && client) {
      try {
        await client.close()
      } catch {
        // Ignore close errors
      }
      client = null
      db = null
    }

    client = new MongoClient(uri, options)
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
