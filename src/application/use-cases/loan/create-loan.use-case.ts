import type { LoanRepository } from "@/domain/repositories/loan.repository"
import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Loan, CreateLoanInput } from "@/domain/entities/loan.entity"

export class CreateLoanUseCase {
  constructor(
    private loanRepository: LoanRepository,
    private bookRepository: BookRepository
  ) {}

  async execute(input: CreateLoanInput): Promise<Loan> {
    const book = await this.bookRepository.findById(input.bookId)

    if (!book) {
      throw new Error("Book not found")
    }

    if (book.availableCopies <= 0) {
      throw new Error("No copies available for loan")
    }

    const loan = await this.loanRepository.create(input)
    await this.bookRepository.updateAvailability(input.bookId, book.availableCopies - 1)

    return loan
  }
}
