export type LoanStatus = "ACTIVE" | "RETURNED" | "OVERDUE"

export interface Loan {
  id: string
  bookId: string
  userId: string
  loanDate: Date
  dueDate: Date
  returnDate?: Date
  status: LoanStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateLoanInput {
  bookId: string
  userId: string
  dueDate: Date
}
