import { ObjectId } from "mongodb"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book, CreateBookInput, UpdateBookInput } from "@/domain/entities/book.entity"
import { getDatabase } from "../database/mongodb"

export class MongoDBBookRepository implements BookRepository {
  private collectionName = "books"

  async create(input: CreateBookInput): Promise<Book> {
    const db = await getDatabase()
    const now = new Date()
    const bookDoc = {
      ...input,
      availableCopies: input.totalCopies,
      status: "AVAILABLE" as const,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(this.collectionName).insertOne(bookDoc)

    return {
      id: result.insertedId.toString(),
      ...bookDoc,
    }
  }

  async findById(id: string): Promise<Book | null> {
    const db = await getDatabase()
    const book = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })

    if (!book) return null

    return {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      category: book.category,
      description: book.description,
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }
  }

  async findAll(): Promise<Book[]> {
    const db = await getDatabase()
    const books = await db.collection(this.collectionName).find({}).toArray()

    return books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      category: book.category,
      description: book.description,
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }))
  }

  async update(id: string, input: UpdateBookInput): Promise<Book> {
    const db = await getDatabase()
    const updateDoc = {
      ...input,
      updatedAt: new Date(),
    }

    await db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updateDoc })

    const book = await this.findById(id)
    if (!book) throw new Error("Book not found after update")

    return book
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) })
  }

  async updateAvailability(id: string, availableCopies: number): Promise<void> {
    const db = await getDatabase()
    const status = availableCopies > 0 ? "AVAILABLE" : "BORROWED"

    await db
      .collection(this.collectionName)
      .updateOne({ _id: new ObjectId(id) }, { $set: { availableCopies, status, updatedAt: new Date() } })
  }

  async search(query: string): Promise<Book[]> {
    const db = await getDatabase()
    const books = await db
      .collection(this.collectionName)
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
          { isbn: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
      .toArray()

    return books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      category: book.category,
      description: book.description,
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }))
  }
}
