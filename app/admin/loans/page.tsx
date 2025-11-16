import { LoansTable } from "@/components/admin/loans/loans-table"
import { CreateLoanDialog } from "@/components/admin/loans/create-loan-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReservationsTable } from "@/components/admin/loans/reservations-table"

export default function LoansPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empréstimos & Reservas</h1>
          <p className="text-muted-foreground">Gerencie empréstimos e reservas de livros</p>
        </div>
        <CreateLoanDialog />
      </div>

      <Tabs defaultValue="loans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="loans">Empréstimos Ativos</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Empréstimos Ativos</CardTitle>
              <CardDescription>Visualize e gerencie todos os empréstimos</CardDescription>
            </CardHeader>
            <CardContent>
              <LoansTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Reservas de Livros</CardTitle>
              <CardDescription>Visualize e gerencie as reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
