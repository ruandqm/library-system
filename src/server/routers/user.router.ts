import { z } from "zod"
import { router, librarianProcedure, protectedProcedure, publicProcedure } from "../trpc"
import { MongoDBUserRepository } from "@/infrastructure/repositories/mongodb-user.repository"
import { TRPCError } from "@trpc/server"

const userRepository = new MongoDBUserRepository()

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(input.email)
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "E-mail já está em uso",
        })
      }

      // Create user with MEMBER role only
      const { password, ...userWithoutPassword } = await userRepository.create({
        ...input,
        role: "MEMBER",
      })

      return userWithoutPassword
    }),

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
