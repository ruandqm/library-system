import type { BookRepository } from "@/domain/repositories/book.repository"
import type { Book } from "@/domain/entities/book.entity"

export class SearchBooksUseCase {
  constructor(private bookRepository: BookRepository) {}

  async execute(query: string): Promise<Book[]> {
    return await this.bookRepository.search(query)
  }
}
