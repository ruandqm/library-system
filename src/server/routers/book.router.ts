import { z } from "zod"
import { router, publicProcedure, adminProcedure } from "../trpc"
import { MongoDBBookRepository } from "@/infrastructure/repositories/mongodb-book.repository"
import { CreateBookUseCase } from "@/application/use-cases/book/create-book.use-case"
import { GetBooksUseCase } from "@/application/use-cases/book/get-books.use-case"
import { UpdateBookUseCase } from "@/application/use-cases/book/update-book.use-case"
import { DeleteBookUseCase } from "@/application/use-cases/book/delete-book.use-case"
import { SearchBooksUseCase } from "@/application/use-cases/book/search-books.use-case"

const bookRepository = new MongoDBBookRepository()

export const bookRouter = router({
  getAll: publicProcedure.query(async () => {
    const useCase = new GetBooksUseCase(bookRepository)
    return await useCase.execute()
  }),

  search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    const useCase = new SearchBooksUseCase(bookRepository)
    return await useCase.execute(input.query)
  }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        author: z.string().min(1),
        isbn: z.string().min(1),
        publisher: z.string().optional(),
        publishedYear: z.number().optional(),
        category: z.string().min(1),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        totalCopies: z.number().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const useCase = new CreateBookUseCase(bookRepository)
      return await useCase.execute(input)
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        author: z.string().min(1).optional(),
        isbn: z.string().min(1).optional(),
        publisher: z.string().optional(),
        publishedYear: z.number().optional(),
        category: z.string().min(1).optional(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        totalCopies: z.number().min(1).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      const useCase = new UpdateBookUseCase(bookRepository)
      return await useCase.execute(id, data)
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const useCase = new DeleteBookUseCase(bookRepository)
    await useCase.execute(input.id)
  }),
})
