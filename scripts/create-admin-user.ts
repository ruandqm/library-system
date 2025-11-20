import { config } from "dotenv"
import { resolve } from "path"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

// Load environment variables from .env file
config({ path: resolve(process.cwd(), ".env") })

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "library"

console.log("MONGODB_URI:", MONGODB_URI)
console.log("MONGODB_DB:", MONGODB_DB)

async function createLibrarianUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(MONGODB_DB)
    const usersCollection = db.collection("users")

    // Check if librarian already exists
    const existingLibrarian = await usersCollection.findOne({
      email: "librarian@library.com",
    })

    if (existingLibrarian) {
      console.log("Librarian user already exists")
      return
    }

    // Create librarian user (acts as administrator)
    const hashedPassword = await bcrypt.hash("librarian123", 10)
    const now = new Date()

    await usersCollection.insertOne({
      name: "Librarian User",
      email: "librarian@library.com",
      password: hashedPassword,
      role: "LIBRARIAN",
      createdAt: now,
      updatedAt: now,
    })

    console.log("Librarian user created successfully")
    console.log("Email: librarian@library.com")
    console.log("Password: librarian123")
  } catch (error) {
    console.error("Error creating librarian user:", error)
  } finally {
    await client.close()
  }
}

createLibrarianUser()
