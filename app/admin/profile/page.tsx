import { AdminProfileForm } from "@/components/admin/admin-profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie as informações da sua conta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize os detalhes do seu perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}
