"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CreateBookInput } from "@/domain/entities/book.entity"

export function CreateBookDialog() {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageValid, setImageValid] = useState<boolean | null>(null)
  const [isValidatingImage, setIsValidatingImage] = useState(false)
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
  } = useForm<CreateBookInput>()

  const categoryId = watch("categoryId")
  const coverImage = watch("coverImage")

  // Validar URL da imagem quando o campo mudar
  useEffect(() => {
    const validateImageUrl = async () => {
      if (!coverImage || coverImage.trim() === "") {
        setImageValid(null)
        setImageUrl("")
        return
      }

      const url = coverImage.trim()
      setImageUrl(url)

      // Verificar se é uma URL válida
      try {
        new URL(url)
      } catch {
        setImageValid(false)
        setIsValidatingImage(false)
        return
      }

      setIsValidatingImage(true)

      // Tentar carregar a imagem para validar se a URL é válida
      const img = new Image()
      img.onload = () => {
        setImageValid(true)
        setIsValidatingImage(false)
      }
      img.onerror = () => {
        setImageValid(false)
        setIsValidatingImage(false)
      }
      img.src = url
    }

    const timeoutId = setTimeout(() => {
      validateImageUrl()
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [coverImage])

  const createBook = trpc.book.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro criado com sucesso",
      })
      utils.book.getAll.invalidate()
      setOpen(false)
      reset()
      setImageUrl("")
      setImageValid(null)
    },
    onError: (error) => {
      const code = (error as any)?.data?.code as string | undefined
      const description =
        code === "FORBIDDEN"
          ? "Você não tem permissão para criar livros."
          : code === "UNAUTHORIZED"
            ? "Faça login para continuar."
            : error.message || "Ocorreu um erro ao criar o livro."
      toast({
        title: "Erro",
        description,
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Resetar estados quando o dialog fechar
      setImageUrl("")
      setImageValid(null)
      setIsValidatingImage(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar Livro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Livro</DialogTitle>
          <DialogDescription>
            Insira os detalhes do novo livro para adicioná-lo à biblioteca
          </DialogDescription>
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
              <Label htmlFor="categoryId">Categoria *</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => setValue("categoryId", value, { shouldValidate: true })}
                required
              >
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
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
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
              {...register("totalCopies", {
                required: "Total de cópias é obrigatório",
              })}
            />
            {errors.totalCopies && (
              <p className="text-sm text-destructive">{errors.totalCopies.message}</p>
            )}
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
            {isValidatingImage && (
              <p className="text-sm text-muted-foreground">Validando URL...</p>
            )}
            {imageValid === false && imageUrl && !isValidatingImage && (
              <p className="text-sm text-destructive">
                URL inválida ou imagem não encontrada. Verifique se a URL está correta.
              </p>
            )}
            {imageValid === true && imageUrl && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-green-600 dark:text-green-400">✓ URL válida</p>
                <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border">
                  <img
                    src={imageUrl}
                    alt="Preview da capa"
                    className="h-full w-full object-cover"
                    onError={() => {
                      setImageValid(false)
                    }}
                  />
                </div>
              </div>
            )}
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
