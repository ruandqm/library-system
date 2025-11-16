import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"

export class GetBooksUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(): Promise<Book[]> {
    return await this.bookRepository.findAll()
  }
}
