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
          throw new Error("E-mail e senha são obrigatórios")
        }

        try {
          const user = await userRepository.findByEmail(credentials.email as string)

          if (!user) {
            throw new Error("E-mail ou senha inválidos")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("E-mail ou senha inválidos")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          // Handle database connection errors
          if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase()

            // Check if it's a MongoDB connection error
            if (
              errorMessage.includes("mongoserverselectionerror") ||
              errorMessage.includes("mongonetworkerror") ||
              errorMessage.includes("ssl") ||
              errorMessage.includes("tls") ||
              errorMessage.includes("connection") ||
              errorMessage.includes("timeout") ||
              errorMessage.includes("connect")
            ) {
              console.error("Database connection error:", error)
              throw new Error(
                "Erro ao conectar com o banco de dados. Por favor, tente novamente mais tarde ou entre em contato com o suporte."
              )
            }

            // Check if it's a database query error
            if (
              errorMessage.includes("mongodb_uri") ||
              errorMessage.includes("environment variable")
            ) {
              console.error("Configuration error:", error)
              throw new Error(
                "Erro de configuração do servidor. Por favor, entre em contato com o suporte."
              )
            }

            // Re-throw other errors with their original message
            console.error("Authentication error:", error)
            throw error
          }

          // Unknown error
          console.error("Unknown authentication error:", error)
          throw new Error("Erro ao processar login. Por favor, tente novamente.")
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
  events: {
    async signIn() {
      // Success event - can be used for logging
    },
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
