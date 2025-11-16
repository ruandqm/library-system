import type { Loan, CreateLoanInput } from "../entities/loan.entity"

export interface LoanRepository {
  create(input: CreateLoanInput): Promise<Loan>
  findById(id: string): Promise<Loan | null>
  findByUserId(userId: string): Promise<Loan[]>
  findByBookId(bookId: string): Promise<Loan[]>
  findAll(): Promise<Loan[]>
  returnLoan(id: string): Promise<Loan>
  updateStatus(id: string, status: "ACTIVE" | "RETURNED" | "OVERDUE"): Promise<void>
}
