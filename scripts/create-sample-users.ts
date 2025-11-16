import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "library"

async function createSampleUsers() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(MONGODB_DB)
    const usersCollection = db.collection("users")

    const now = new Date()

    const users = [
      {
        name: "John Librarian",
        email: "librarian@library.com",
        password: await bcrypt.hash("librarian123", 10),
        role: "LIBRARIAN",
        phone: "+1234567890",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Jane Member",
        email: "member@library.com",
        password: await bcrypt.hash("member123", 10),
        role: "MEMBER",
        phone: "+1234567891",
        address: "123 Main St, City, State",
        createdAt: now,
        updatedAt: now,
      },
    ]

    for (const user of users) {
      const existing = await usersCollection.findOne({ email: user.email })
      if (!existing) {
        await usersCollection.insertOne(user)
        console.log(`Created user: ${user.email}`)
      } else {
        console.log(`User already exists: ${user.email}`)
      }
    }

    console.log("\nSample users created successfully!")
    console.log("\nLogin credentials:")
    console.log("Admin - Email: admin@library.com, Password: admin123")
    console.log("Librarian - Email: librarian@library.com, Password: librarian123")
    console.log("Member - Email: member@library.com, Password: member123")
  } catch (error) {
    console.error("Error creating sample users:", error)
  } finally {
    await client.close()
  }
}

createSampleUsers()
