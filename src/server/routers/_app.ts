import { router } from "../trpc"
import { bookRouter } from "./book.router"
import { loanRouter } from "./loan.router"
import { reservationRouter } from "./reservation.router"
import { userRouter } from "./user.router"

export const appRouter = router({
  book: bookRouter,
  loan: loanRouter,
  reservation: reservationRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
