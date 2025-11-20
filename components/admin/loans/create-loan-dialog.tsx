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
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface CreateLoanForm {
  bookId: string
  userId: string
  dueDate: string
}

export function CreateLoanDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: books } = trpc.book.getAll.useQuery()
  const { data: users } = trpc.user.getAll.useQuery()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateLoanForm>()

  const createLoan = trpc.loan.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Empréstimo criado com sucesso",
      })
      utils.loan.getAll.invalidate()
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

  const onSubmit = (data: CreateLoanForm) => {
    createLoan.mutate({
      bookId: data.bookId,
      userId: data.userId,
      dueDate: new Date(data.dueDate),
    })
  }

  const availableBooks = books?.filter((book) => book.availableCopies > 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Criar Empréstimo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Empréstimo</DialogTitle>
          <DialogDescription>Emitir um livro para um membro da biblioteca</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bookId">Livro *</Label>
            <Select onValueChange={(value) => setValue("bookId", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um livro" />
              </SelectTrigger>
              <SelectContent>
                {availableBooks?.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} - {book.author} ({book.availableCopies} disponível(is))
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Membro *</Label>
            <Select onValueChange={(value) => setValue("userId", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro" />
              </SelectTrigger>
              <SelectContent>
                {users
                  ?.filter((user) => user.role === "MEMBER")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Devolução *</Label>
            <Input
              id="dueDate"
              type="date"
              {...register("dueDate", { required: "Data de devolução é obrigatória" })}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createLoan.isPending}>
              {createLoan.isPending ? "Criando..." : "Criar Empréstimo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
