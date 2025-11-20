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
  const isAtlas = uri.includes("mongodb.net") || uri.includes("atlas")
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL

  // Configure MongoDB client options
  const options: MongoClientOptions = {
    // Enable TLS/SSL for Atlas or production environments
    ...(isAtlas || isProduction
      ? {
          tls: true,
          // MongoDB Atlas uses valid certificates, so don't allow invalid ones in production
          tlsAllowInvalidCertificates: false,
        }
      : {}),
    // Connection pool options for serverless environments
    maxPoolSize: isProduction ? 1 : 10, // Serverless works better with smaller pools
    minPoolSize: isProduction ? 0 : 1,
    // Server selection timeout
    serverSelectionTimeoutMS: 10000,
    // Socket timeout
    socketTimeoutMS: 45000,
    // Connection timeout
    connectTimeoutMS: 10000,
    // Retry writes for better reliability
    retryWrites: true,
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
