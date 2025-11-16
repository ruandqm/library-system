import type { BookRepository } from "@/domain/repositories/book.repository"

export class DeleteBookUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id)
    if (!book) {
      throw new Error("Book not found")
    }
    await this.bookRepository.delete(id)
  }
}
