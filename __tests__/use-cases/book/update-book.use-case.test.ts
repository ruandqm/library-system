import { describe, it, expect, vi, beforeEach } from "vitest"
import { UpdateBookUseCase } from "@/application/use-cases/book/update-book.use-case"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"

describe("UpdateBookUseCase", () => {
  let mockBookRepository: BookRepository
  let updateBookUseCase: UpdateBookUseCase

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
    updateBookUseCase = new UpdateBookUseCase(mockBookRepository)
  })

  it("should update a book successfully", async () => {
    const existingBook: Book = {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Programming",
      totalCopies: 5,
      availableCopies: 5,
      status: "AVAILABLE",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updateInput = {
      title: "Clean Code - Updated",
      totalCopies: 10,
    }

    const updatedBook: Book = {
      ...existingBook,
      ...updateInput,
      updatedAt: new Date(),
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(existingBook)
    vi.mocked(mockBookRepository.update).mockResolvedValue(updatedBook)

    const result = await updateBookUseCase.execute("1", updateInput)

    expect(mockBookRepository.findById).toHaveBeenCalledWith("1")
    expect(mockBookRepository.update).toHaveBeenCalledWith("1", updateInput)
    expect(result.title).toBe("Clean Code - Updated")
    expect(result.totalCopies).toBe(10)
  })

  it("should throw error when book not found", async () => {
    vi.mocked(mockBookRepository.findById).mockResolvedValue(null)

    await expect(updateBookUseCase.execute("999", { title: "New Title" })).rejects.toThrow(
      "Book not found"
    )

    expect(mockBookRepository.findById).toHaveBeenCalledWith("999")
    expect(mockBookRepository.update).not.toHaveBeenCalled()
  })
})
