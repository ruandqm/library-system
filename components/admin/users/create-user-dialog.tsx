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
import { Label } from "@/components/ui/label"
import { PlusIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPhone } from "@/lib/utils"

interface CreateUserForm {
  name: string
  email: string
  password: string
  role: "LIBRARIAN" | "MEMBER"
  phone?: string
  address?: string
}

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserForm>()

  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      })
      utils.user.getAll.invalidate()
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

  const onSubmit = (data: CreateUserForm) => {
    createUser.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>Criar uma nova conta de usuário da biblioteca</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" {...register("name", { required: "Nome é obrigatório" })} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "E-mail é obrigatório" })}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Senha é obrigatória", minLength: 6 })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função *</Label>
            <Select onValueChange={(value) => setValue("role", value as any)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Membro</SelectItem>
                <SelectItem value="LIBRARIAN">Bibliotecário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", {
                onChange: (e) => {
                  e.target.value = formatPhone(e.target.value)
                },
              })}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" {...register("address")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
