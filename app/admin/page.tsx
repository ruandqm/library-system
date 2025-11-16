import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, UsersIcon, BookMarkedIcon, CalendarIcon } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Painel</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão da biblioteca</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookMarkedIcon className="size-5 text-primary" />
              Livros Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <CardDescription>Livros na biblioteca</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenIcon className="size-5 text-blue-500" />
              Livros Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <CardDescription>Prontos para empréstimo</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="size-5 text-orange-500" />
              Empréstimos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <CardDescription>Atualmente emprestados</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UsersIcon className="size-5 text-green-500" />
              Total de Membros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <CardDescription>Usuários registrados</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Tarefas comuns e atalhos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="/admin/books"
                className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <BookMarkedIcon className="size-6 text-primary" />
                <h3 className="font-semibold">Gerenciar Livros</h3>
                <p className="text-sm text-muted-foreground">Adicionar, editar ou remover livros da biblioteca</p>
              </a>
              <a
                href="/admin/loans"
                className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <CalendarIcon className="size-6 text-orange-500" />
                <h3 className="font-semibold">Gerenciar Empréstimos</h3>
                <p className="text-sm text-muted-foreground">Processar empréstimos e devoluções</p>
              </a>
              <a
                href="/admin/users"
                className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <UsersIcon className="size-6 text-green-500" />
                <h3 className="font-semibold">Gerenciar Usuários</h3>
                <p className="text-sm text-muted-foreground">Visualizar e gerenciar membros da biblioteca</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
