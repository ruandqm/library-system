import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book, UpdateBookInput } from "@/domain/entities/book.entity"

export class UpdateBookUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(id: string, input: UpdateBookInput): Promise<Book> {
    const book = await this.bookRepository.findById(id)
    if (!book) {
      throw new Error("Book not found")
    }
    return await this.bookRepository.update(id, input)
  }
}
