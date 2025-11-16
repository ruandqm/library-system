import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect based on role
  if (session.user.role === "LIBRARIAN") {
    redirect("/admin")
  } else {
    redirect("/portal")
  }
}
