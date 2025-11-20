"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, CheckCircleIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export function LoansTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: loans, isLoading } = trpc.loan.getAll.useQuery()
  const { data: books } = trpc.book.getAll.useQuery()
  const { data: users } = trpc.user.getAll.useQuery()

  const returnLoan = trpc.loan.return.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro devolvido com sucesso",
      })
      utils.loan.getAll.invalidate()
      utils.book.getAll.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const getBookTitle = (bookId: string) => {
    return books?.find((b) => b.id === bookId)?.title || "Livro desconhecido"
  }

  const getUserName = (userId: string) => {
    return users?.find((u) => u.id === userId)?.name || "Usuário desconhecido"
  }

  const filteredLoans = loans?.filter((loan) => {
    const bookTitle = getBookTitle(loan.bookId).toLowerCase()
    const userName = getUserName(loan.userId).toLowerCase()
    const query = searchQuery.toLowerCase()
    return bookTitle.includes(query) || userName.includes(query)
  })

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquise por título do livro ou nome do usuário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Livro</TableHead>
              <TableHead>Leitor</TableHead>
              <TableHead>Data do Empréstimo</TableHead>
              <TableHead>Data de Devolução</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans && filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{getBookTitle(loan.bookId)}</TableCell>
                  <TableCell>{getUserName(loan.userId)}</TableCell>
                  <TableCell>{format(new Date(loan.loanDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(new Date(loan.dueDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(loan.status, loan.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    {loan.status === "ACTIVE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => returnLoan.mutate({ id: loan.id })}
                        disabled={returnLoan.isPending}
                      >
                        <CheckCircleIcon className="size-4" />
                        Devolver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery
                    ? "Nenhum empréstimo encontrado para sua busca."
                    : "Nenhum empréstimo ativo."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
