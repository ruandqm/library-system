import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PortalNav } from "@/components/portal/portal-nav"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalNav user={session.user} />
      <main className="flex-1 bg-muted/30 p-6">{children}</main>
    </div>
  )
}
