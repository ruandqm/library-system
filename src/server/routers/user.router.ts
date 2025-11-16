import { z } from "zod"
import { router, adminProcedure, protectedProcedure } from "../trpc"
import { MongoDBUserRepository } from "@/infrastructure/repositories/mongodb-user.repository"

const userRepository = new MongoDBUserRepository()

export const userRouter = router({
  getAll: adminProcedure.query(async () => {
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

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["ADMIN", "LIBRARIAN", "MEMBER"]),
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

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await userRepository.delete(input.id)
  }),
})
