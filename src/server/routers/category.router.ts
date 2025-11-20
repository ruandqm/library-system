import { z } from "zod"
import { router, publicProcedure, librarianProcedure } from "../trpc"
import { MongoDBCategoryRepository } from "@/infrastructure/repositories/mongodb-category.repository"
import { TRPCError } from "@trpc/server"

const categoryRepository = new MongoDBCategoryRepository()

export const categoryRouter = router({
  getAll: publicProcedure.query(async () => {
    return await categoryRepository.findAll()
  }),

  create: librarianProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome da categoria é obrigatório"),
      }),
    )
    .mutation(async ({ input }) => {
      // Check if category already exists
      const existingCategory = await categoryRepository.findByName(input.name)
      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Categoria já existe",
        })
      }

      return await categoryRepository.create(input)
    }),

  delete: librarianProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await categoryRepository.delete(input.id)
  }),
})

