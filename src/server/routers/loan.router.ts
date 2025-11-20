import { z } from "zod"
import { router, librarianProcedure, protectedProcedure } from "../trpc"
import { MongoDBLoanRepository } from "@/infrastructure/repositories/mongodb-loan.repository"
import { MongoDBBookRepository } from "@/infrastructure/repositories/mongodb-book.repository"
import { CreateLoanUseCase } from "@/application/use-cases/loan/create-loan.use-case"
import { ReturnLoanUseCase } from "@/application/use-cases/loan/return-loan.use-case"

const loanRepository = new MongoDBLoanRepository()
const bookRepository = new MongoDBBookRepository()

export const loanRouter = router({
  getAll: librarianProcedure.query(async () => {
    return await loanRepository.findAll()
  }),

  getMyLoans: protectedProcedure.query(async ({ ctx }) => {
    return await loanRepository.findByUserId(ctx.session.user.id)
  }),

  create: librarianProcedure
    .input(
      z.object({
        bookId: z.string(),
        userId: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const useCase = new CreateLoanUseCase(loanRepository, bookRepository)
      return await useCase.execute(input)
    }),

  return: librarianProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const useCase = new ReturnLoanUseCase(loanRepository, bookRepository)
    return await useCase.execute(input.id)
  }),
})
