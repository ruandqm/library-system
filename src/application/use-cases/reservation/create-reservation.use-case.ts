import type { ReservationRepository } from "@/domain/repositories/reservation.repository"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Reservation, CreateReservationInput } from "@/domain/entities/reservation.entity"

export class CreateReservationUseCase {
  constructor(
    private reservationRepository: ReservationRepository,
    private bookRepository: BookRepository
  ) {}

  async execute(input: CreateReservationInput): Promise<Reservation> {
    const book = await this.bookRepository.findById(input.bookId)

    if (!book) {
      throw new Error("Book not found")
    }

    // Check if user already has a pending reservation for this book
    const userReservations = await this.reservationRepository.findByUserId(input.userId)
    const existingReservation = userReservations.find(
      (r) => r.bookId === input.bookId && r.status === "PENDING"
    )

    if (existingReservation) {
      throw new Error("You already have a pending reservation for this book")
    }

    return await this.reservationRepository.create(input)
  }
}
