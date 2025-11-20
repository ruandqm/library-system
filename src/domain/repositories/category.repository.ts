import type { Category, CreateCategoryInput } from "../entities/category.entity"

export interface CategoryRepository {
  create(input: CreateCategoryInput): Promise<Category>
  findById(id: string): Promise<Category | null>
  findByName(name: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  delete(id: string): Promise<void>
}

