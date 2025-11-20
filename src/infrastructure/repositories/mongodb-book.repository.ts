import { ObjectId } from "mongodb"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book, CreateBookInput, UpdateBookInput } from "@/domain/entities/book.entity"
import { getDatabase } from "../database/mongodb"

export class MongoDBBookRepository implements BookRepository {
  private collectionName = "books"

  private async populateCategory(book: any): Promise<Book> {
    const db = await getDatabase()
    let categoryName: string | undefined

    if (book.categoryId) {
      const category = await db
        .collection("categories")
        .findOne({ _id: new ObjectId(book.categoryId) })
      categoryName = category?.name
    }

    return {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      categoryId: book.categoryId || book.category, // Support migration from old data
      categoryName,
      description: book.description,
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }
  }

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
    const book = { _id: result.insertedId, ...bookDoc }

    return await this.populateCategory(book)
  }

  async findById(id: string): Promise<Book | null> {
    const db = await getDatabase()
    const book = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })

    if (!book) return null

    return await this.populateCategory(book)
  }

  async findAll(): Promise<Book[]> {
    const db = await getDatabase()
    const books = await db.collection(this.collectionName).find({}).toArray()

    if (books.length === 0) return []

    // Batch lookup categories
    const categoryIds = [...new Set(books.map((book) => book.categoryId).filter(Boolean))]
    const categories = await db
      .collection("categories")
      .find({ _id: { $in: categoryIds.map((id) => new ObjectId(id)) } })
      .toArray()

    const categoryMap = new Map(categories.map((cat) => [cat._id.toString(), cat.name]))

    return books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      categoryId: book.categoryId || book.category, // Support migration from old data
      categoryName: book.categoryId ? categoryMap.get(book.categoryId) : undefined,
      description: book.description,
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }))
  }

  async findAllPaginated(limit: number, offset: number): Promise<{ books: Book[]; total: number }> {
    const db = await getDatabase()

    // Get total count
    const total = await db.collection(this.collectionName).countDocuments()

    // Get paginated books
    const books = await db
      .collection(this.collectionName)
      .find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()

    if (books.length === 0) return { books: [], total }

    // Batch lookup categories
    const categoryIds = [...new Set(books.map((book) => book.categoryId).filter(Boolean))]
    const categories = await db
      .collection("categories")
      .find({ _id: { $in: categoryIds.map((id) => new ObjectId(id)) } })
      .toArray()

    const categoryMap = new Map(categories.map((cat) => [cat._id.toString(), cat.name]))

    const populatedBooks = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      categoryId: book.categoryId || book.category, // Support migration from old data
      categoryName: book.categoryId ? categoryMap.get(book.categoryId) : undefined,
      description: book.description,
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }))

    return { books: populatedBooks, total }
  }

  async update(id: string, input: UpdateBookInput): Promise<Book> {
    const db = await getDatabase()
    const updateDoc = {
      ...input,
      updatedAt: new Date(),
    }

    await db
      .collection(this.collectionName)
      .updateOne({ _id: new ObjectId(id) }, { $set: updateDoc })

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
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { availableCopies, status, updatedAt: new Date() } }
      )
  }

  async search(query: string): Promise<Book[]> {
    const db = await getDatabase()

    // First, find matching categories
    const matchingCategories = await db
      .collection("categories")
      .find({ name: { $regex: query, $options: "i" } })
      .toArray()
    const categoryIds = matchingCategories.map((cat) => cat._id.toString())

    const books = await db
      .collection(this.collectionName)
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
          { isbn: { $regex: query, $options: "i" } },
          ...(categoryIds.length > 0 ? [{ categoryId: { $in: categoryIds } }] : []),
          // Support legacy category field for migration
          { category: { $regex: query, $options: "i" } },
        ],
      })
      .toArray()

    if (books.length === 0) return []

    // Batch lookup categories
    const allCategoryIds = [...new Set(books.map((book) => book.categoryId).filter(Boolean))]
    const categories = await db
      .collection("categories")
      .find({ _id: { $in: allCategoryIds.map((id) => new ObjectId(id)) } })
      .toArray()

    const categoryMap = new Map(categories.map((cat) => [cat._id.toString(), cat.name]))

    return books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      categoryId: book.categoryId || book.category, // Support migration from old data
      categoryName: book.categoryId ? categoryMap.get(book.categoryId) : undefined,
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
