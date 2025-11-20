import { CategoriesTable } from "@/components/admin/categories/categories-table"
import { CreateCategoryDialog } from "@/components/admin/categories/create-category-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias dos livros da biblioteca</p>
        </div>
        <CreateCategoryDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Categorias</CardTitle>
          <CardDescription>Visualize e gerencie todas as categorias disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable />
        </CardContent>
      </Card>
    </div>
  )
}
