import { MyLoansTable } from "@/components/portal/my-loans-table"
import { MyReservationsTable } from "@/components/portal/my-reservations-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyLoansPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Meus Empréstimos & Reservas</h1>
        <p className="text-muted-foreground">Acompanhe seus livros emprestados e reservas</p>
      </div>

      <Tabs defaultValue="loans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="loans">Meus Empréstimos</TabsTrigger>
          <TabsTrigger value="reservations">Minhas Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Empréstimos Ativos</CardTitle>
              <CardDescription>Livros que você emprestou atualmente</CardDescription>
            </CardHeader>
            <CardContent>
              <MyLoansTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Reservas</CardTitle>
              <CardDescription>Livros que você reservou</CardDescription>
            </CardHeader>
            <CardContent>
              <MyReservationsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
