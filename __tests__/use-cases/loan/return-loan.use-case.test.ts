import { describe, it, expect, vi, beforeEach } from "vitest"
import { ReturnLoanUseCase } from "@/application/use-cases/loan/return-loan.use-case"
import type { LoanRepository } from "@/domain/repositories/loan.repository"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"
import type { Loan } from "@/domain/entities/loan.entity"

describe("ReturnLoanUseCase", () => {
  let mockLoanRepository: LoanRepository
  let mockBookRepository: BookRepository
  let returnLoanUseCase: ReturnLoanUseCase

  beforeEach(() => {
    mockLoanRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByBookId: vi.fn(),
      findAll: vi.fn(),
      returnLoan: vi.fn(),
      updateStatus: vi.fn(),
    }

    mockBookRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateAvailability: vi.fn(),
      search: vi.fn(),
    }

    returnLoanUseCase = new ReturnLoanUseCase(mockLoanRepository, mockBookRepository)
  })

  it("should return a loan successfully", async () => {
    const activeLoan: Loan = {
      id: "loan1",
      bookId: "book1",
      userId: "user1",
      loanDate: new Date("2024-01-01"),
      dueDate: new Date("2024-12-31"),
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const returnedLoan: Loan = {
      ...activeLoan,
      returnDate: new Date(),
      status: "RETURNED",
      updatedAt: new Date(),
    }

    const book: Book = {
      id: "book1",
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      totalCopies: 5,
      availableCopies: 2,
      status: "AVAILABLE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockLoanRepository.findById).mockResolvedValue(activeLoan)
    vi.mocked(mockBookRepository.findById).mockResolvedValue(book)
    vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(returnedLoan)
    vi.mocked(mockBookRepository.updateAvailability).mockResolvedValue(undefined)

    const result = await returnLoanUseCase.execute("loan1")

    expect(mockLoanRepository.findById).toHaveBeenCalledWith("loan1")
    expect(mockBookRepository.findById).toHaveBeenCalledWith("book1")
    expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith("loan1")
    expect(mockBookRepository.updateAvailability).toHaveBeenCalledWith("book1", 3)
    expect(result.status).toBe("RETURNED")
  })

  it("should throw error when loan not found", async () => {
    vi.mocked(mockLoanRepository.findById).mockResolvedValue(null)

    await expect(returnLoanUseCase.execute("nonexistent")).rejects.toThrow("Loan not found")

    expect(mockLoanRepository.findById).toHaveBeenCalledWith("nonexistent")
    expect(mockLoanRepository.returnLoan).not.toHaveBeenCalled()
  })

  it("should throw error when loan already returned", async () => {
    const returnedLoan: Loan = {
      id: "loan1",
      bookId: "book1",
      userId: "user1",
      loanDate: new Date("2024-01-01"),
      dueDate: new Date("2024-12-31"),
      returnDate: new Date("2024-06-15"),
      status: "RETURNED",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockLoanRepository.findById).mockResolvedValue(returnedLoan)

    await expect(returnLoanUseCase.execute("loan1")).rejects.toThrow("Loan already returned")

    expect(mockLoanRepository.findById).toHaveBeenCalledWith("loan1")
    expect(mockLoanRepository.returnLoan).not.toHaveBeenCalled()
  })
})
