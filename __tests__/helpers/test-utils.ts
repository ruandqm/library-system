import { vi } from "vitest"
import type { Book } from "@/domain/entities/book.entity"
import type { Loan } from "@/domain/entities/loan.entity"
import type { Reservation } from "@/domain/entities/reservation.entity"
import type { User } from "@/domain/entities/user.entity"

export const createMockBook = (overrides?: Partial<Book>): Book => ({
  id: "book-1",
  title: "Test Book",
  author: "Test Author",
  isbn: "978-1234567890",
  category: "Test Category",
  totalCopies: 5,
  availableCopies: 5,
  status: "AVAILABLE",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockLoan = (overrides?: Partial<Loan>): Loan => ({
  id: "loan-1",
  bookId: "book-1",
  userId: "user-1",
  loanDate: new Date(),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  status: "ACTIVE",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockReservation = (overrides?: Partial<Reservation>): Reservation => ({
  id: "reservation-1",
  bookId: "book-1",
  userId: "user-1",
  reservationDate: new Date(),
  expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  password: "hashedpassword",
  role: "MEMBER",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockRepository = <T extends Record<string, any>>() => {
  const methods: Record<string, any> = {}
  const mockRepo = new Proxy(
    {},
    {
      get: (target, prop: string) => {
        if (!methods[prop]) {
          methods[prop] = vi.fn()
        }
        return methods[prop]
      },
    },
  )
  return mockRepo as T
}

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
