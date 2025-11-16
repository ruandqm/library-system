"use client"

import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, BookmarkIcon, ClockIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function ProfileStats() {
  const { data: loans, isLoading: loansLoading } = trpc.loan.getMyLoans.useQuery()
  const { data: reservations, isLoading: reservationsLoading } = trpc.reservation.getMyReservations.useQuery()

  const activeLoans = loans?.filter((loan) => loan.status === "ACTIVE").length || 0
  const activeReservations = reservations?.filter((res) => res.status === "PENDING").length || 0
  const totalBorrowed = loans?.length || 0

  if (loansLoading || reservationsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Empréstimos Ativos</CardTitle>
          <BookOpenIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLoans}</div>
          <p className="text-xs text-muted-foreground">Atualmente emprestados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
          <BookmarkIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeReservations}</div>
          <p className="text-xs text-muted-foreground">Reservas pendentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Emprestado</CardTitle>
          <ClockIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBorrowed}</div>
          <p className="text-xs text-muted-foreground">Desde sempre</p>
        </CardContent>
      </Card>
    </div>
  )
}
