import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book, CreateBookInput } from "@/domain/entities/book.entity"

export class CreateBookUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(input: CreateBookInput): Promise<Book> {
    return await this.bookRepository.create(input)
  }
}
