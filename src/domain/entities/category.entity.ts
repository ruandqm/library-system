export interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryInput {
  name: string
}
