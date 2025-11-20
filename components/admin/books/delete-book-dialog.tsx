"use client"

import { trpc } from "@/lib/trpc"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/domain/entities/book.entity"

interface DeleteBookDialogProps {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBookDialog({ book, open, onOpenChange }: DeleteBookDialogProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const deleteBook = trpc.book.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro excluído com sucesso",
      })
      utils.book.getAll.invalidate()
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso excluirá permanentemente <span className="font-semibold">{book.title}</span> de{" "}
            {book.author}. Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteBook.mutate({ id: book.id })}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteBook.isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
