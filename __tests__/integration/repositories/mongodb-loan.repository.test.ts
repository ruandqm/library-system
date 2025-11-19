import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest"
import { MongoDBLoanRepository } from "@/infrastructure/repositories/mongodb-loan.repository"
import { MongoClient, type Db } from "mongodb"
import type { CreateLoanInput } from "@/domain/entities/loan.entity"
import { vi } from "vitest"

describe("MongoDBLoanRepository Integration Tests", () => {
  let client: MongoClient
  let db: Db
  let repository: MongoDBLoanRepository
  const testDbName = "library-test-loans"

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
    client = new MongoClient(uri)
    
    try {
      await client.connect()
      db = client.db(testDbName)

      const originalGetDatabase = await import("@/infrastructure/database/mongodb")
      vi.spyOn(originalGetDatabase, "getDatabase").mockResolvedValue(db)

      repository = new MongoDBLoanRepository()
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error)
      throw error
    }
  }, 30000) // 30 second timeout

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
  }, 30000) // 30 second timeout

  beforeEach(async () => {
    if (db) {
      await db.collection("loans").deleteMany({})
    }
  })

  it("should create a loan", async () => {
    const input: CreateLoanInput = {
      bookId: "book123",
      userId: "user123",
      dueDate: new Date("2024-12-31"),
    }

    const loan = await repository.create(input)

    expect(loan.id).toBeDefined()
    expect(loan.bookId).toBe(input.bookId)
    expect(loan.userId).toBe(input.userId)
    expect(loan.status).toBe("ACTIVE")
    expect(loan.loanDate).toBeDefined()
  })

  it("should find loans by user ID", async () => {
    await repository.create({
      bookId: "book1",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    await repository.create({
      bookId: "book2",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    await repository.create({
      bookId: "book3",
      userId: "user2",
      dueDate: new Date("2024-12-31"),
    })

    const user1Loans = await repository.findByUserId("user1")
    expect(user1Loans).toHaveLength(2)

    const user2Loans = await repository.findByUserId("user2")
    expect(user2Loans).toHaveLength(1)
  })

  it("should return a loan", async () => {
    const loan = await repository.create({
      bookId: "book1",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    expect(loan.status).toBe("ACTIVE")
    expect(loan.returnDate).toBeUndefined()

    const returnedLoan = await repository.returnLoan(loan.id)

    expect(returnedLoan.status).toBe("RETURNED")
    expect(returnedLoan.returnDate).toBeDefined()
  })

  it("should update loan status", async () => {
    const loan = await repository.create({
      bookId: "book1",
      userId: "user1",
      dueDate: new Date("2024-01-01"),
    })

    await repository.updateStatus(loan.id, "OVERDUE")

    const updatedLoan = await repository.findById(loan.id)
    expect(updatedLoan?.status).toBe("OVERDUE")
  })

  it("should find loans by book ID", async () => {
    await repository.create({
      bookId: "book1",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    await repository.create({
      bookId: "book1",
      userId: "user2",
      dueDate: new Date("2024-12-31"),
    })

    const bookLoans = await repository.findByBookId("book1")
    expect(bookLoans).toHaveLength(2)
  })
})
