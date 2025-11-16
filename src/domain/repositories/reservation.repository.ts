import type { Reservation, CreateReservationInput } from "../entities/reservation.entity"

export interface ReservationRepository {
  create(input: CreateReservationInput): Promise<Reservation>
  findById(id: string): Promise<Reservation | null>
  findByUserId(userId: string): Promise<Reservation[]>
  findByBookId(bookId: string): Promise<Reservation[]>
  findAll(): Promise<Reservation[]>
  cancel(id: string): Promise<void>
  fulfill(id: string): Promise<void>
}
