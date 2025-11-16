import { BooksTable } from "@/components/admin/books/books-table"
import { CreateBookDialog } from "@/components/admin/books/create-book-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BooksPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Livros</h1>
          <p className="text-muted-foreground">Gerencie a coleção de livros da sua biblioteca</p>
        </div>
        <CreateBookDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Livros</CardTitle>
          <CardDescription>Visualize e gerencie todos os livros da biblioteca</CardDescription>
        </CardHeader>
        <CardContent>
          <BooksTable />
        </CardContent>
      </Card>
    </div>
  )
}
