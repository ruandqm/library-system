import { describe, it, expect, vi, beforeEach } from "vitest"
import { CreateReservationUseCase } from "@/application/use-cases/reservation/create-reservation.use-case"
import type { ReservationRepository } from "@/domain/repositories/reservation.repository"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"
import type { Reservation } from "@/domain/entities/reservation.entity"

describe("CreateReservationUseCase", () => {
  let mockReservationRepository: ReservationRepository
  let mockBookRepository: BookRepository
  let createReservationUseCase: CreateReservationUseCase

  beforeEach(() => {
    mockReservationRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByBookId: vi.fn(),
      findAll: vi.fn(),
      cancel: vi.fn(),
      fulfill: vi.fn(),
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

    createReservationUseCase = new CreateReservationUseCase(
      mockReservationRepository,
      mockBookRepository
    )
  })

  it("should create a reservation successfully", async () => {
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

    const reservationInput = {
      bookId: "book1",
      userId: "user1",
    }

    const expectedReservation: Reservation = {
      id: "reservation1",
      ...reservationInput,
      reservationDate: new Date(),
      expiryDate: new Date(),
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(book)
    vi.mocked(mockReservationRepository.findByUserId).mockResolvedValue([])
    vi.mocked(mockReservationRepository.create).mockResolvedValue(expectedReservation)

    const result = await createReservationUseCase.execute(reservationInput)

    expect(mockBookRepository.findById).toHaveBeenCalledWith("book1")
    expect(mockReservationRepository.findByUserId).toHaveBeenCalledWith("user1")
    expect(mockReservationRepository.create).toHaveBeenCalledWith(reservationInput)
    expect(result).toEqual(expectedReservation)
  })

  it("should throw error when book not found", async () => {
    const reservationInput = {
      bookId: "nonexistent",
      userId: "user1",
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(null)

    await expect(createReservationUseCase.execute(reservationInput)).rejects.toThrow(
      "Book not found"
    )

    expect(mockBookRepository.findById).toHaveBeenCalledWith("nonexistent")
    expect(mockReservationRepository.create).not.toHaveBeenCalled()
  })

  it("should throw error when user already has pending reservation", async () => {
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

    const existingReservation: Reservation = {
      id: "reservation1",
      bookId: "book1",
      userId: "user1",
      reservationDate: new Date(),
      expiryDate: new Date(),
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const reservationInput = {
      bookId: "book1",
      userId: "user1",
    }

    vi.mocked(mockBookRepository.findById).mockResolvedValue(book)
    vi.mocked(mockReservationRepository.findByUserId).mockResolvedValue([existingReservation])

    await expect(createReservationUseCase.execute(reservationInput)).rejects.toThrow(
      "You already have a pending reservation for this book"
    )

    expect(mockBookRepository.findById).toHaveBeenCalledWith("book1")
    expect(mockReservationRepository.findByUserId).toHaveBeenCalledWith("user1")
    expect(mockReservationRepository.create).not.toHaveBeenCalled()
  })
})
