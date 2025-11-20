import type { Book, CreateBookInput, UpdateBookInput } from "../entities/book.entity"

export interface BookRepository {
  create(input: CreateBookInput): Promise<Book>
  findById(id: string): Promise<Book | null>
  findAll(): Promise<Book[]>
  findAllPaginated(limit: number, offset: number): Promise<{ books: Book[]; total: number }>
  update(id: string, input: UpdateBookInput): Promise<Book>
  delete(id: string): Promise<void>
  updateAvailability(id: string, availableCopies: number): Promise<void>
  search(query: string): Promise<Book[]>
}
