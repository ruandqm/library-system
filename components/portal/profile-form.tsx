"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"

interface ProfileFormData {
  name: string
  phone?: string
  address?: string
}

export function ProfileForm() {
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: user, isLoading } = trpc.user.getMe.useQuery()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>()

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user, reset])

  const updateProfile = trpc.user.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      })
      utils.user.getMe.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={user?.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Input id="role" value={user?.role} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">
            A função é atribuída pelos administradores
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input id="name" {...register("name", { required: "Nome é obrigatório" })} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" type="tel" {...register("phone")} placeholder="+55 (11) 99999-0000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="Rua Exemplo, 123, Cidade, Estado, CEP"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
          Restaurar
        </Button>
        <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
