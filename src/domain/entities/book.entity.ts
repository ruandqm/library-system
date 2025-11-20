export type BookStatus = "AVAILABLE" | "BORROWED" | "RESERVED"

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publisher?: string
  publishedYear?: number
  categoryId: string
  categoryName?: string // Populated from category collection
  description?: string
  coverImage?: string
  totalCopies: number
  availableCopies: number
  status: BookStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateBookInput {
  title: string
  author: string
  isbn: string
  publisher?: string
  publishedYear?: number
  categoryId: string
  description?: string
  coverImage?: string
  totalCopies: number
}

export interface UpdateBookInput {
  title?: string
  author?: string
  isbn?: string
  publisher?: string
  publishedYear?: number
  categoryId?: string
  description?: string
  coverImage?: string
  totalCopies?: number
}
