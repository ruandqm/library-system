import type { LoanRepository } from "@/domain/repositories/loan.repository"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Loan } from "@/domain/entities/loan.entity"

export class ReturnLoanUseCase {
  constructor(
    private loanRepository: LoanRepository,
    private bookRepository: BookRepository,
  ) {}

  async execute(loanId: string): Promise<Loan> {
    const loan = await this.loanRepository.findById(loanId)

    if (!loan) {
      throw new Error("Loan not found")
    }

    if (loan.status === "RETURNED") {
      throw new Error("Loan already returned")
    }

    const book = await this.bookRepository.findById(loan.bookId)
    if (!book) {
      throw new Error("Book not found")
    }

    const returnedLoan = await this.loanRepository.returnLoan(loanId)
    await this.bookRepository.updateAvailability(loan.bookId, book.availableCopies + 1)

    return returnedLoan
  }
}
