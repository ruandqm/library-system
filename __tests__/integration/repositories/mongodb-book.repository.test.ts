import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest"
import { MongoDBBookRepository } from "@/infrastructure/repositories/mongodb-book.repository"
import { MongoClient, type Db } from "mongodb"
import type { CreateBookInput } from "@/domain/entities/book.entity"

describe("MongoDBBookRepository Integration Tests", () => {
  let client: MongoClient
  let db: Db
  let repository: MongoDBBookRepository
  const testDbName = "library-test-books"

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
    
    // Retry connection logic
    let retries = 5
    let lastError: Error | null = null
    
    while (retries > 0) {
      try {
        // Create a new client for each attempt
        client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        })
        
        await client.connect()
        db = client.db(testDbName)

        // Mock getDatabase to return test database
        const originalGetDatabase = await import("@/infrastructure/database/mongodb")
        vi.spyOn(originalGetDatabase, "getDatabase").mockResolvedValue(db)

        repository = new MongoDBBookRepository()
        return // Success, exit retry loop
      } catch (error) {
        lastError = error as Error
        // Close client if it was created
        if (client) {
          try {
            await client.close()
          } catch {
            // Ignore close errors
          }
          client = null as any
        }
        retries--
        if (retries > 0) {
          console.log(`Connection attempt failed, retrying... (${5 - retries}/5)`)
          await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
        }
      }
    }
    
    // If we get here, all retries failed
    console.error("Failed to connect to MongoDB after 5 attempts:", lastError)
    throw lastError || new Error("Failed to connect to MongoDB")
  }, 60000) // 60 second timeout

  afterAll(async () => {
    if (db) {
      try {
        await db.dropDatabase()
      } catch (error) {
        console.error("Failed to drop database:", error)
      }
    }
    if (client) {
      try {
        await client.close()
      } catch (error) {
        console.error("Failed to close client:", error)
      }
    }
  }, 60000) // 60 second timeout

  beforeEach(async () => {
    if (db) {
      await db.collection("books").deleteMany({})
    }
  })

  it("should create a book and retrieve it", async () => {
    const input: CreateBookInput = {
      title: "Clean Architecture",
      author: "Robert C. Martin",
      isbn: "978-0134494166",
      category: "Software Engineering",
      totalCopies: 5,
    }

    const createdBook = await repository.create(input)

    expect(createdBook.id).toBeDefined()
    expect(createdBook.title).toBe(input.title)
    expect(createdBook.author).toBe(input.author)
    expect(createdBook.availableCopies).toBe(5)
    expect(createdBook.status).toBe("AVAILABLE")

    const foundBook = await repository.findById(createdBook.id)
    expect(foundBook).not.toBeNull()
    expect(foundBook?.title).toBe(input.title)
  })

  it("should update book availability", async () => {
    const input: CreateBookInput = {
      title: "Domain-Driven Design",
      author: "Eric Evans",
      isbn: "978-0321125217",
      category: "Software Engineering",
      totalCopies: 3,
    }

    const book = await repository.create(input)
    await repository.updateAvailability(book.id, 1)

    const updatedBook = await repository.findById(book.id)
    expect(updatedBook?.availableCopies).toBe(1)
    expect(updatedBook?.status).toBe("AVAILABLE")

    await repository.updateAvailability(book.id, 0)
    const borrowedBook = await repository.findById(book.id)
    expect(borrowedBook?.availableCopies).toBe(0)
    expect(borrowedBook?.status).toBe("BORROWED")
  })

  it("should search books by title, author, or category", async () => {
    await repository.create({
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      totalCopies: 5,
    })

    await repository.create({
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      isbn: "978-0201616224",
      category: "Programming",
      totalCopies: 3,
    })

    await repository.create({
      title: "Design Patterns",
      author: "Gang of Four",
      isbn: "978-0201633610",
      category: "Software Design",
      totalCopies: 4,
    })

    const cleanResults = await repository.search("Clean")
    expect(cleanResults).toHaveLength(1)
    expect(cleanResults[0].title).toBe("Clean Code")

    const programmingResults = await repository.search("Programming")
    expect(programmingResults).toHaveLength(2)

    const martinResults = await repository.search("Martin")
    expect(martinResults).toHaveLength(1)
  })

  it("should delete a book", async () => {
    const book = await repository.create({
      title: "Test Book",
      author: "Test Author",
      isbn: "123456789",
      category: "Test",
      totalCopies: 1,
    })

    await repository.delete(book.id)

    const deletedBook = await repository.findById(book.id)
    expect(deletedBook).toBeNull()
  })

  it("should find all books", async () => {
    await repository.create({
      title: "Book 1",
      author: "Author 1",
      isbn: "111",
      category: "Category 1",
      totalCopies: 1,
    })

    await repository.create({
      title: "Book 2",
      author: "Author 2",
      isbn: "222",
      category: "Category 2",
      totalCopies: 2,
    })

    const allBooks = await repository.findAll()
    expect(allBooks).toHaveLength(2)
  })
})
