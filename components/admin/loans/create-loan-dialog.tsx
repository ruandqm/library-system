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
import { PlusIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface CreateLoanForm {
  bookId: string
  userId: string
  dueDate: string
}

export function CreateLoanDialog() {
  const [open, setOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
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

  const bookId = watch("bookId")
  const userId = watch("userId")

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
      setBookOpen(false)
      setUserOpen(false)
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
    if (!data.bookId || !data.userId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um livro e um membro",
        variant: "destructive",
      })
      return
    }
    createLoan.mutate({
      bookId: data.bookId,
      userId: data.userId,
      dueDate: new Date(data.dueDate),
    })
  }

  const availableBooks = books?.filter((book) => book.availableCopies > 0) || []
  const members = users?.filter((user) => user.role === "MEMBER") || []

  const selectedBook = availableBooks.find((book) => book.id === bookId)
  const selectedUser = members.find((user) => user.id === userId)

  const handleDialogOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setBookOpen(false)
      setUserOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Criar Empréstimo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Criar Novo Empréstimo</DialogTitle>
          <DialogDescription>Emitir um livro para um membro da biblioteca</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-hidden">
          <div className="space-y-2">
            <Label htmlFor="bookId">Livro *</Label>
            <Popover open={bookOpen} onOpenChange={setBookOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={bookOpen}
                  className="w-full justify-between min-w-0 overflow-hidden whitespace-normal [&>span]:truncate"
                  type="button"
                >
                  <span className="text-left flex-1 min-w-0 mr-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedBook
                      ? `${selectedBook.title} - ${selectedBook.author} (${selectedBook.availableCopies} disponível(is))`
                      : "Selecione um livro..."}
                  </span>
                  <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Pesquisar livro..." />
                  <CommandList>
                    <CommandEmpty>Nenhum livro encontrado.</CommandEmpty>
                    <CommandGroup>
                      {availableBooks.map((book) => (
                        <CommandItem
                          key={book.id}
                          value={`${book.title} ${book.author} ${book.isbn}`}
                          onSelect={() => {
                            setValue("bookId", book.id, { shouldValidate: true })
                            setBookOpen(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              bookId === book.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {book.title} - {book.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {book.availableCopies} disponível(is)
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.bookId && <p className="text-sm text-destructive">{errors.bookId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Membro *</Label>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={userOpen}
                  className="w-full justify-between min-w-0 overflow-hidden whitespace-normal [&>span]:truncate"
                  type="button"
                >
                  <span className="text-left flex-1 min-w-0 mr-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedUser
                      ? `${selectedUser.name} - ${selectedUser.email}`
                      : "Selecione um membro..."}
                  </span>
                  <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Pesquisar membro..." />
                  <CommandList>
                    <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                    <CommandGroup>
                      {members.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.name} ${user.email}`}
                          onSelect={() => {
                            setValue("userId", user.id, { shouldValidate: true })
                            setUserOpen(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              userId === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.userId && <p className="text-sm text-destructive">{errors.userId.message}</p>}
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
