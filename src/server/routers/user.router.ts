import { z } from "zod"
import { router, librarianProcedure, protectedProcedure } from "../trpc"
import { MongoDBUserRepository } from "@/infrastructure/repositories/mongodb-user.repository"

const userRepository = new MongoDBUserRepository()

export const userRouter = router({
  getAll: librarianProcedure.query(async () => {
    return await userRepository.findAll()
  }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await userRepository.findById(ctx.session.user.id)
    if (!user) {
      throw new Error("User not found")
    }
    // Don't return password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }),

  create: librarianProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["LIBRARIAN", "MEMBER"]),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await userRepository.create(input)
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await userRepository.update(ctx.session.user.id, input)
    }),

  delete: librarianProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await userRepository.delete(input.id)
  }),
})
