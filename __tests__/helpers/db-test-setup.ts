import { MongoMemoryServer } from "mongodb-memory-server"
import { MongoClient, Db } from "mongodb"
import { vi } from "vitest"

let mongod: MongoMemoryServer
let mongoClient: MongoClient
let db: Db

export const connect = async () => {
  // Start the in-memory MongoDB instance
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  // Connect to it
  mongoClient = new MongoClient(uri)
  await mongoClient.connect()
  db = mongoClient.db()

  // Mock the getDatabase function to return our in-memory DB
  // We need to use vi.mock in the test files usually, but since we are mocking the implementation
  // of an imported module for the duration of the test, spying might work if the module isn't cached/frozen differently.
  // Ideally, we spy on the exported function.

  const mongodbModule = await import("@/infrastructure/database/mongodb")
  vi.spyOn(mongodbModule, "getDatabase").mockResolvedValue(db)

  return { mongoClient, db }
}

export const close = async () => {
  if (mongoClient) {
    await mongoClient.close()
  }
  if (mongod) {
    await mongod.stop()
  }
}

export const clear = async () => {
  if (db) {
    const collections = await db.collections()
    for (const collection of collections) {
      await collection.deleteMany({})
    }
  }
}
