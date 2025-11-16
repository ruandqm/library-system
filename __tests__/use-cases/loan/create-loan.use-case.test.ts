import { describe, it, expect, vi, beforeEach } from "vitest"
import { CreateLoanUseCase } from "@/application/use-cases/loan/create-loan.use-case"
import type { LoanRepository } from "@/domain/repositories/loan.repository"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"
import type { Loan } from "@/domain/entities/loan.entity"

describe("CreateLoanUseCase", () => {
  let mockLoanRepository: LoanRepository
  let mockBookRepository: BookRepository
  let createLoanUseCase: CreateLoanUseCase

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

    createLoanUseCase = new CreateLoanUseCase(mockLoanRepository, mockBookRepository)
  })

  it("should create a loan successfully", async () => {
    const book: Book = {
      id: "book1",
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      totalCopies: 5,
      availableCopies: 3,
      status: "AVAILABLE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const loanInput = {
      bookId: "book1",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    }

    const expectedLoan: Loan = {
      id: "loan1",
      ...loanInput,
      loanDate: new Date(),
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(book)
    vi.mocked(mockLoanRepository.create).mockResolvedValue(expectedLoan)
    vi.mocked(mockBookRepository.updateAvailability).mockResolvedValue(undefined)

    const result = await createLoanUseCase.execute(loanInput)

    expect(mockBookRepository.findById).toHaveBeenCalledWith("book1")
    expect(mockLoanRepository.create).toHaveBeenCalledWith(loanInput)
    expect(mockBookRepository.updateAvailability).toHaveBeenCalledWith("book1", 2)
    expect(result).toEqual(expectedLoan)
  })

  it("should throw error when book not found", async () => {
    const loanInput = {
      bookId: "nonexistent",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(null)

    await expect(createLoanUseCase.execute(loanInput)).rejects.toThrow("Book not found")

    expect(mockBookRepository.findById).toHaveBeenCalledWith("nonexistent")
    expect(mockLoanRepository.create).not.toHaveBeenCalled()
  })

  it("should throw error when no copies available", async () => {
    const book: Book = {
      id: "book1",
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      totalCopies: 5,
      availableCopies: 0,
      status: "BORROWED",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const loanInput = {
      bookId: "book1",
      userId: "user1",
      dueDate: new Date("2024-12-31"),
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(book)

    await expect(createLoanUseCase.execute(loanInput)).rejects.toThrow("No copies available for loan")

    expect(mockBookRepository.findById).toHaveBeenCalledWith("book1")
    expect(mockLoanRepository.create).not.toHaveBeenCalled()
  })
})
