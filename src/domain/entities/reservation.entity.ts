export type ReservationStatus = "PENDING" | "FULFILLED" | "CANCELLED"

export interface Reservation {
  id: string
  bookId: string
  userId: string
  reservationDate: Date
  expiryDate: Date
  status: ReservationStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateReservationInput {
  bookId: string
  userId: string
}
