"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { trpc } from "@/lib/trpc"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Book, UpdateBookInput } from "@/domain/entities/book.entity"

interface UpdateBookDialogProps {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateBookDialog({ book, open, onOpenChange }: UpdateBookDialogProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const { data: categories } = trpc.category.getAll.useQuery()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateBookInput>()

  const categoryId = watch("categoryId")

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        categoryId: book.categoryId,
        publisher: book.publisher,
        publishedYear: book.publishedYear,
        totalCopies: book.totalCopies,
        description: book.description,
        coverImage: book.coverImage,
      })
    }
  }, [book, reset])

  const updateBook = trpc.book.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro atualizado com sucesso",
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

  const onSubmit = (data: UpdateBookInput) => {
    updateBook.mutate({
      id: book.id,
      ...data,
      publishedYear: data.publishedYear ? Number(data.publishedYear) : undefined,
      totalCopies: data.totalCopies ? Number(data.totalCopies) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Livro</DialogTitle>
          <DialogDescription>Atualize os detalhes do livro</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input id="author" {...register("author")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" {...register("isbn")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select value={categoryId} onValueChange={(value) => setValue("categoryId", value)}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="publisher">Editora</Label>
              <Input id="publisher" {...register("publisher")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedYear">Ano de Publicação</Label>
              <Input id="publishedYear" type="number" {...register("publishedYear")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCopies">Total de Cópias</Label>
            <Input id="totalCopies" type="number" min="1" {...register("totalCopies")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">URL da Imagem de Capa</Label>
            <Input
              id="coverImage"
              type="url"
              {...register("coverImage")}
              placeholder="https://..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateBook.isPending}>
              {updateBook.isPending ? "Atualizando..." : "Atualizar Livro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
