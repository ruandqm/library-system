import { z } from "zod"
import { router, protectedProcedure, librarianProcedure } from "../trpc"
import { MongoDBReservationRepository } from "@/infrastructure/repositories/mongodb-reservation.repository"
import { MongoDBBookRepository } from "@/infrastructure/repositories/mongodb-book.repository"
import { CreateReservationUseCase } from "@/application/use-cases/reservation/create-reservation.use-case"

const reservationRepository = new MongoDBReservationRepository()
const bookRepository = new MongoDBBookRepository()

export const reservationRouter = router({
  getAll: librarianProcedure.query(async () => {
    return await reservationRepository.findAll()
  }),

  getMyReservations: protectedProcedure.query(async ({ ctx }) => {
    return await reservationRepository.findByUserId(ctx.session.user.id)
  }),

  create: protectedProcedure.input(z.object({ bookId: z.string() })).mutation(async ({ input, ctx }) => {
    const useCase = new CreateReservationUseCase(reservationRepository, bookRepository)
    return await useCase.execute({
      bookId: input.bookId,
      userId: ctx.session.user.id,
    })
  }),

  cancel: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await reservationRepository.cancel(input.id)
  }),
})
