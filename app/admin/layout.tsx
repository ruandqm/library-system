import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "LIBRARIAN") {
    redirect("/portal")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav user={session.user} />
      <main className="flex-1 bg-muted/30 p-6">{children}</main>
    </div>
  )
}
