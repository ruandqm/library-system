import { MongoClient, type Db, type MongoClientOptions } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }

  const uri = process.env.MONGODB_URI
  const isVercel = !!process.env.VERCEL

  // Configure MongoDB client options
  // MongoDB Atlas handles TLS/SSL automatically via the connection string
  // Don't override TLS settings as it can cause conflicts
  const options: MongoClientOptions = {
    // Connection pool options optimized for serverless (Vercel)
    maxPoolSize: isVercel ? 1 : 10, // Vercel works best with pool size 1
    minPoolSize: isVercel ? 0 : 1, // Allow connections to close in serverless
    // Timeouts optimized for serverless environments
    serverSelectionTimeoutMS: isVercel ? 20000 : 10000,
    socketTimeoutMS: isVercel ? 60000 : 45000,
    connectTimeoutMS: isVercel ? 20000 : 10000,
    // Retry configuration for reliability
    retryWrites: true,
    retryReads: true,
    // Compression for better performance
    compressors: isVercel ? [] : ["zlib"], // Skip compression on Vercel to reduce CPU usage
  }

  client = new MongoClient(uri, options)
  await client.connect()
  db = client.db(process.env.MONGODB_DB || "library")

  return db
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    return await connectToDatabase()
  }
  return db
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
