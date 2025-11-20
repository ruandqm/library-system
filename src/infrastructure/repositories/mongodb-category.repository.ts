import { ObjectId } from "mongodb"
import type { CategoryRepository } from "@/domain/repositories/category.repository"
import type { Category, CreateCategoryInput } from "@/domain/entities/category.entity"
import { getDatabase } from "../database/mongodb"

export class MongoDBCategoryRepository implements CategoryRepository {
  private collectionName = "categories"

  async create(input: CreateCategoryInput): Promise<Category> {
    const db = await getDatabase()
    const now = new Date()
    const categoryDoc = {
      ...input,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(this.collectionName).insertOne(categoryDoc)

    return {
      id: result.insertedId.toString(),
      ...categoryDoc,
    }
  }

  async findById(id: string): Promise<Category | null> {
    const db = await getDatabase()
    const category = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })

    if (!category) return null

    return {
      id: category._id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }

  async findByName(name: string): Promise<Category | null> {
    const db = await getDatabase()
    const category = await db.collection(this.collectionName).findOne({ name })

    if (!category) return null

    return {
      id: category._id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }

  async findAll(): Promise<Category[]> {
    const db = await getDatabase()
    const categories = await db.collection(this.collectionName).find({}).sort({ name: 1 }).toArray()

    return categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) })
  }
}
