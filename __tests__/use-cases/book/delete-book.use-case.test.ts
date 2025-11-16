import { describe, it, expect, vi, beforeEach } from "vitest"
import { DeleteBookUseCase } from "@/application/use-cases/book/delete-book.use-case"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"

describe("DeleteBookUseCase", () => {
  let mockBookRepository: BookRepository
  let deleteBookUseCase: DeleteBookUseCase

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
    deleteBookUseCase = new DeleteBookUseCase(mockBookRepository)
  })

  it("should delete a book successfully", async () => {
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

    vi.mocked(mockBookRepository.findById).mockResolvedValue(existingBook)
    vi.mocked(mockBookRepository.delete).mockResolvedValue(undefined)

    await deleteBookUseCase.execute("1")

    expect(mockBookRepository.findById).toHaveBeenCalledWith("1")
    expect(mockBookRepository.delete).toHaveBeenCalledWith("1")
  })

  it("should throw error when book not found", async () => {
    vi.mocked(mockBookRepository.findById).mockResolvedValue(null)

    await expect(deleteBookUseCase.execute("999")).rejects.toThrow("Book not found")

    expect(mockBookRepository.findById).toHaveBeenCalledWith("999")
    expect(mockBookRepository.delete).not.toHaveBeenCalled()
  })
})
