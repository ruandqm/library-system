import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }

  client = new MongoClient(process.env.MONGODB_URI)
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
