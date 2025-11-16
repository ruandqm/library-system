import { ObjectId } from "mongodb"
import type { UserRepository } from "@/domain/repositories/user.repository"
import type { User, CreateUserInput, UpdateUserInput } from "@/domain/entities/user.entity"
import { getDatabase } from "../database/mongodb"
import bcrypt from "bcryptjs"

export class MongoDBUserRepository implements UserRepository {
  private collectionName = "users"

  async create(input: CreateUserInput): Promise<User> {
    const db = await getDatabase()
    const hashedPassword = await bcrypt.hash(input.password, 10)

    const now = new Date()
    const userDoc = {
      ...input,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(this.collectionName).insertOne(userDoc)

    return {
      id: result.insertedId.toString(),
      ...userDoc,
    }
  }

  async findById(id: string): Promise<User | null> {
    const db = await getDatabase()
    const user = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })

    if (!user) return null

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase()
    const user = await db.collection(this.collectionName).findOne({ email })

    if (!user) return null

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const db = await getDatabase()
    const updateDoc = {
      ...input,
      updatedAt: new Date(),
    }

    await db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updateDoc })

    const user = await this.findById(id)
    if (!user) throw new Error("User not found after update")

    return user
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) })
  }

  async findAll(): Promise<User[]> {
    const db = await getDatabase()
    const users = await db.collection(this.collectionName).find({}).toArray()

    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }
}
