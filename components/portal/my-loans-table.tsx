"use client"

import { trpc } from "@/lib/trpc"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { format } from "date-fns"
import { BookOpenIcon } from "lucide-react"

export function MyLoansTable() {
  const { data: loans, isLoading } = trpc.loan.getMyLoans.useQuery()
  const { data: books } = trpc.book.getAll.useQuery()

  const getBookTitle = (bookId: string) => {
    return books?.find((b) => b.id === bookId)?.title || "Livro desconhecido"
  }

  const getBookAuthor = (bookId: string) => {
    return books?.find((b) => b.id === bookId)?.author || "Autor desconhecido"
  }

  const getStatusBadge = (status: string, dueDate: Date) => {
    if (status === "RETURNED") {
      return <Badge variant="secondary">Devolvido</Badge>
    }
    if (status === "OVERDUE" || new Date() > new Date(dueDate)) {
      return <Badge variant="destructive">Atrasado</Badge>
    }
    return <Badge variant="default">Ativo</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpenIcon className="size-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Nenhum empréstimo ativo</p>
        <p className="text-sm text-muted-foreground">Explore livros para emprestar na biblioteca</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Livro</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data do Empréstimo</TableHead>
            <TableHead>Data de Devolução</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{getBookTitle(loan.bookId)}</TableCell>
              <TableCell>{getBookAuthor(loan.bookId)}</TableCell>
              <TableCell>{format(new Date(loan.loanDate), "MMM dd, yyyy")}</TableCell>
              <TableCell>{format(new Date(loan.dueDate), "MMM dd, yyyy")}</TableCell>
              <TableCell>{getStatusBadge(loan.status, loan.dueDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
