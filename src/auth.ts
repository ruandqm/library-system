import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { MongoDBUserRepository } from "@/infrastructure/repositories/mongodb-user.repository"
import { UserRole } from "@/domain/entities/user.entity"

const userRepository = new MongoDBUserRepository()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await userRepository.findByEmail(credentials.email as string)

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          // Only log actual errors (database connection, etc)
          console.error("Authentication error:", error)

          // If it's a database connection error, we might want to throw it
          // so the user knows it's a system error, not bad credentials.
          if (error instanceof Error) {
            const msg = error.message.toLowerCase()
            if (msg.includes("mongo") || msg.includes("connect") || msg.includes("timeout")) {
              throw new Error("Erro de conexão com o banco de dados")
            }
          }

          // For other errors, return null to indicate auth failure (generic)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
