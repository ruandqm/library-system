"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookmarkIcon } from "lucide-react"
import type { Book } from "@/domain/entities/book.entity"
import { trpc } from "@/lib/trpc"
import { useToast } from "@/hooks/use-toast"

interface BookDetailsDialogProps {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookDetailsDialog({ book, open, onOpenChange }: BookDetailsDialogProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro reservado com sucesso",
      })
      utils.reservation.getMyReservations.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{book.title}</DialogTitle>
              <DialogDescription className="text-base">{book.author}</DialogDescription>
            </div>
            <Badge variant={book.availableCopies > 0 ? "default" : "secondary"}>
              {book.availableCopies > 0 ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">ISBN</p>
              <p className="text-sm text-muted-foreground">{book.isbn}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Categoria</p>
              <p className="text-sm text-muted-foreground">{book.category}</p>
            </div>
            {book.publisher && (
              <div>
                <p className="text-sm font-medium">Editora</p>
                <p className="text-sm text-muted-foreground">{book.publisher}</p>
              </div>
            )}
            {book.publishedYear && (
              <div>
                <p className="text-sm font-medium">Ano de Publicação</p>
                <p className="text-sm text-muted-foreground">{book.publishedYear}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Cópias Disponíveis</p>
              <p className="text-sm text-muted-foreground">
                {book.availableCopies} de {book.totalCopies}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">{book.status}</p>
            </div>
          </div>

          {book.description && (
            <>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium">Descrição</p>
                <p className="text-sm text-muted-foreground">{book.description}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={() => createReservation.mutate({ bookId: book.id })}
            disabled={book.availableCopies === 0 || createReservation.isPending}
          >
            <BookmarkIcon className="size-4" />
            {createReservation.isPending ? "Reservando..." : "Reservar Livro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
