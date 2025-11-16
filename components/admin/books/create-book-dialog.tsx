"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { trpc } from "@/lib/trpc"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CreateBookInput } from "@/domain/entities/book.entity"

export function CreateBookDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookInput>()

  const createBook = trpc.book.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro criado com sucesso",
      })
      utils.book.getAll.invalidate()
      setOpen(false)
      reset()
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: CreateBookInput) => {
    createBook.mutate({
      ...data,
      publishedYear: data.publishedYear ? Number(data.publishedYear) : undefined,
      totalCopies: Number(data.totalCopies),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar Livro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Livro</DialogTitle>
          <DialogDescription>Insira os detalhes do novo livro para adicioná-lo à biblioteca</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" {...register("title", { required: "Título é obrigatório" })} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input id="author" {...register("author", { required: "Autor é obrigatório" })} />
              {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input id="isbn" {...register("isbn", { required: "ISBN é obrigatório" })} />
              {errors.isbn && <p className="text-sm text-destructive">{errors.isbn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input id="category" {...register("category", { required: "Categoria é obrigatória" })} />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
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
            <Label htmlFor="totalCopies">Total de Cópias *</Label>
            <Input
              id="totalCopies"
              type="number"
              min="1"
              {...register("totalCopies", { required: "Total de cópias é obrigatório" })}
            />
            {errors.totalCopies && <p className="text-sm text-destructive">{errors.totalCopies.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">URL da Imagem de Capa</Label>
            <Input id="coverImage" type="url" {...register("coverImage")} placeholder="https://..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createBook.isPending}>
              {createBook.isPending ? "Criando..." : "Criar Livro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
