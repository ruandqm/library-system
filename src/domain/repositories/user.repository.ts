import type { User, CreateUserInput, UpdateUserInput } from "../entities/user.entity"

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, input: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>
  findAll(): Promise<User[]>
}
