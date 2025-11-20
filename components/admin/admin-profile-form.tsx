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
import { formatPhone } from "@/lib/utils"

interface ProfileFormData {
  name: string
  phone?: string
  address?: string
}

export function AdminProfileForm() {
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
        title: "Success",
        description: "Profile updated successfully",
      })
      utils.user.getMe.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Error",
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={user?.role} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">Role is assigned by administrators</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
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
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
          Reset
        </Button>
        <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
