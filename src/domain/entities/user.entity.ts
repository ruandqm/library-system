export type UserRole = "LIBRARIAN" | "MEMBER"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  address?: string
}

export interface UpdateUserInput {
  name?: string
  phone?: string
  address?: string
}
