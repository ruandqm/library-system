"use client"

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
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { BookmarkIcon, XIcon } from "lucide-react"

export function MyReservationsTable() {
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: reservations, isLoading } = trpc.reservation.getMyReservations.useQuery()
  const { data: books } = trpc.book.getAll.useQuery()

  const cancelReservation = trpc.reservation.cancel.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Reserva cancelada com sucesso",
      })
      utils.reservation.getMyReservations.invalidate()
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

  const getBookAuthor = (bookId: string) => {
    return books?.find((b) => b.id === bookId)?.author || "Autor desconhecido"
  }

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

  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookmarkIcon className="size-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Sem reservas</p>
        <p className="text-sm text-muted-foreground">
          Reserve livros para garantir disponibilidade quando precisar
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Livro</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data da Reserva</TableHead>
            <TableHead>Data de Expiração</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{getBookTitle(reservation.bookId)}</TableCell>
              <TableCell>{getBookAuthor(reservation.bookId)}</TableCell>
              <TableCell>{format(new Date(reservation.reservationDate), "MMM dd, yyyy")}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
