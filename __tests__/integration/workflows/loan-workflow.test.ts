import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest"
import { CreateLoanUseCase } from "@/application/use-cases/loan/create-loan.use-case"
import { ReturnLoanUseCase } from "@/application/use-cases/loan/return-loan.use-case"
import { MongoDBBookRepository } from "@/infrastructure/repositories/mongodb-book.repository"
import { MongoDBLoanRepository } from "@/infrastructure/repositories/mongodb-loan.repository"
import { connect, close, clear } from "../../helpers/db-test-setup"

describe("Loan Workflow Integration Tests", () => {
  let bookRepository: MongoDBBookRepository
  let loanRepository: MongoDBLoanRepository
  let createLoanUseCase: CreateLoanUseCase
  let returnLoanUseCase: ReturnLoanUseCase

  beforeAll(async () => {
    await connect()
    bookRepository = new MongoDBBookRepository()
    loanRepository = new MongoDBLoanRepository()
    createLoanUseCase = new CreateLoanUseCase(loanRepository, bookRepository)
    returnLoanUseCase = new ReturnLoanUseCase(loanRepository, bookRepository)
  })

  afterAll(async () => {
    await close()
  })

  beforeEach(async () => {
    await clear()
  })

  it("should complete full loan lifecycle: create loan, check availability, return loan", async () => {
    // Create a book
    const book = await bookRepository.create({
      title: "Test Book",
      author: "Test Author",
      isbn: "123456789",
      category: "Test",
      totalCopies: 3,
    })

    expect(book.availableCopies).toBe(3)
    expect(book.status).toBe("AVAILABLE")

    // Create first loan
    const loan1 = await createLoanUseCase.execute({
      bookId: book.id,
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    expect(loan1.status).toBe("ACTIVE")

    // Check book availability decreased
    const bookAfterLoan1 = await bookRepository.findById(book.id)
    expect(bookAfterLoan1?.availableCopies).toBe(2)

    // Create second loan
    const loan2 = await createLoanUseCase.execute({
      bookId: book.id,
      userId: "user2",
      dueDate: new Date("2024-12-31"),
    })

    const bookAfterLoan2 = await bookRepository.findById(book.id)
    expect(bookAfterLoan2?.availableCopies).toBe(1)

    // Return first loan
    await returnLoanUseCase.execute(loan1.id)

    const bookAfterReturn = await bookRepository.findById(book.id)
    expect(bookAfterReturn?.availableCopies).toBe(2)

    // Verify loan is returned
    const returnedLoan = await loanRepository.findById(loan1.id)
    expect(returnedLoan?.status).toBe("RETURNED")
    expect(returnedLoan?.returnDate).toBeDefined()
  })

  it("should prevent loan when no copies available", async () => {
    const book = await bookRepository.create({
      title: "Popular Book",
      author: "Famous Author",
      isbn: "987654321",
      category: "Fiction",
      totalCopies: 1,
    })

    // Create first loan
    await createLoanUseCase.execute({
      bookId: book.id,
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    // Try to create second loan - should fail
    await expect(
      createLoanUseCase.execute({
        bookId: book.id,
        userId: "user2",
        dueDate: new Date("2024-12-31"),
      })
    ).rejects.toThrow("No copies available for loan")

    // Verify book status
    const bookAfter = await bookRepository.findById(book.id)
    expect(bookAfter?.availableCopies).toBe(0)
    expect(bookAfter?.status).toBe("BORROWED")
  })

  it("should prevent returning a loan twice", async () => {
    const book = await bookRepository.create({
      title: "Test Book",
      author: "Test Author",
      isbn: "111222333",
      category: "Test",
      totalCopies: 2,
    })

    const loan = await createLoanUseCase.execute({
      bookId: book.id,
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    })

    // Return loan first time
    await returnLoanUseCase.execute(loan.id)

    // Try to return again - should fail
    await expect(returnLoanUseCase.execute(loan.id)).rejects.toThrow("Loan already returned")
  })
})
