import { initTRPC, TRPCError } from "@trpc/server"
import type { Session } from "next-auth"
import superjson from "superjson"

interface Context {
  session: Session | null
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

const isLibrarian = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  if (ctx.session.user.role !== "LIBRARIAN") {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

const isMember = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  if (
    ctx.session.user.role !== "MEMBER" &&
    ctx.session.user.role !== "LIBRARIAN"
  ) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const librarianProcedure = t.procedure.use(isLibrarian)
export const memberProcedure = t.procedure.use(isMember)
