"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, XIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export function ReservationsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: reservations, isLoading } = trpc.reservation.getAll.useQuery()
  const { data: books } = trpc.book.getAll.useQuery()
  const { data: users } = trpc.user.getAll.useQuery()

  const cancelReservation = trpc.reservation.cancel.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Reserva cancelada com sucesso",
      })
      utils.reservation.getAll.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const getBookTitle = (bookId: string) => {
    return books?.find((b) => b.id === bookId)?.title || "Livro desconhecido"
  }

  const getUserName = (userId: string) => {
    return users?.find((u) => u.id === userId)?.name || "Usuário desconhecido"
  }

  const filteredReservations = reservations?.filter((reservation) => {
    const bookTitle = getBookTitle(reservation.bookId).toLowerCase()
    const userName = getUserName(reservation.userId).toLowerCase()
    const query = searchQuery.toLowerCase()
    return bookTitle.includes(query) || userName.includes(query)
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      PENDING: "default",
      FULFILLED: "secondary",
      CANCELLED: "destructive",
    }
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      FULFILLED: "Concluída",
      CANCELLED: "Cancelada",
    }
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquise por título do livro ou nome do usuário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Livro</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Data da Reserva</TableHead>
              <TableHead>Data de Expiração</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations && filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{getBookTitle(reservation.bookId)}</TableCell>
                  <TableCell>{getUserName(reservation.userId)}</TableCell>
                  <TableCell>
                    {format(new Date(reservation.reservationDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{format(new Date(reservation.expiryDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell className="text-right">
                    {reservation.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelReservation.mutate({ id: reservation.id })}
                        disabled={cancelReservation.isPending}
                      >
                        <XIcon className="size-4" />
                        Cancelar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery ? "Nenhuma reserva encontrada para sua busca." : "Nenhuma reserva."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
