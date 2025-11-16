import { describe, it, expect, vi, beforeEach } from "vitest"
import { CreateBookUseCase } from "@/application/use-cases/book/create-book.use-case"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"

describe("CreateBookUseCase", () => {
  let mockBookRepository: BookRepository
  let createBookUseCase: CreateBookUseCase

  beforeEach(() => {
    mockBookRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateAvailability: vi.fn(),
      search: vi.fn(),
    }
    createBookUseCase = new CreateBookUseCase(mockBookRepository)
  })

  it("should create a book successfully", async () => {
    const input = {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      totalCopies: 5,
    }

    const expectedBook: Book = {
      id: "1",
      ...input,
      availableCopies: 5,
      status: "AVAILABLE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockBookRepository.create).mockResolvedValue(expectedBook)

    const result = await createBookUseCase.execute(input)

    expect(mockBookRepository.create).toHaveBeenCalledWith(input)
    expect(result).toEqual(expectedBook)
  })

  it("should create a book with optional fields", async () => {
    const input = {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      isbn: "978-0201616224",
      publisher: "Addison-Wesley",
      publishedYear: 1999,
      category: "Programming",
      description: "A great book for developers",
      coverImage: "https://example.com/cover.jpg",
      totalCopies: 3,
    }

    const expectedBook: Book = {
      id: "2",
      ...input,
      availableCopies: 3,
      status: "AVAILABLE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockBookRepository.create).mockResolvedValue(expectedBook)

    const result = await createBookUseCase.execute(input)

    expect(result).toEqual(expectedBook)
    expect(result.publisher).toBe("Addison-Wesley")
    expect(result.publishedYear).toBe(1999)
  })
})
