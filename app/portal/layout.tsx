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
      <main className="flex-1 bg-muted/30 px-4 py-4 pb-16 sm:px-6 sm:py-6 sm:pb-6">{children}</main>
    </div>
  )
}
