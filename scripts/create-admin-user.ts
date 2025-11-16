import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "library"

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(MONGODB_DB)
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@library.com" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const now = new Date()

    await usersCollection.insertOne({
      name: "Admin User",
      email: "admin@library.com",
      password: hashedPassword,
      role: "ADMIN",
      createdAt: now,
      updatedAt: now,
    })

    console.log("Admin user created successfully")
    console.log("Email: admin@library.com")
    console.log("Password: admin123")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
  }
}

createAdminUser()
