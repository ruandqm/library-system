"use client"

import { trpc } from "@/lib/trpc"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpenIcon, BookmarkIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useState, useMemo, useEffect, useRef } from "react"
import { BookDetailsDialog } from "./book-details-dialog"
import type { Book } from "@/domain/entities/book.entity"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface BooksGridProps {
  searchQuery?: string
  categoryId?: string | null
}

const BOOKS_PER_PAGE = 12

export function BooksGrid({ searchQuery = "", categoryId = null }: BooksGridProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.book.getAllPaginated.useInfiniteQuery(
      {
        limit: BOOKS_PER_PAGE,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      }
    )

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    if (!data) return []

    const allBooks = data.pages.flatMap((page) => page.books)

    return allBooks.filter((book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !categoryId || book.categoryId === categoryId

      return matchesSearch && matchesCategory
    })
  }, [data, searchQuery, categoryId])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro reservado com sucesso",
      })
      utils.reservation.getMyReservations.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleReserve = (bookId: string) => {
    createReservation.mutate({ bookId })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!data || filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpenIcon className="size-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">
          {searchQuery || categoryId ? "Nenhum livro encontrado" : "Nenhum livro disponível"}
        </p>
        <p className="text-sm text-muted-foreground">
          {searchQuery || categoryId
            ? "Tente ajustar seus filtros de busca"
            : "Volte mais tarde para novas adições"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="flex flex-col" data-testid="book-card">
            <CardHeader>
              <div className="mb-2 flex items-start justify-between">
                <Badge variant={book.availableCopies > 0 ? "default" : "secondary"}>
                  {book.availableCopies > 0 ? "Disponível" : "Indisponível"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {book.availableCopies}/{book.totalCopies} cópias
                </span>
              </div>
              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="line-clamp-1">{book.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <AspectRatio ratio={3 / 4} className="mb-4 overflow-hidden rounded-md bg-muted">
                <img
                  src={book.coverImage || "/placeholder.jpg"}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </AspectRatio>
              <div className="space-y-2 text-sm">
                {book.categoryName && (
                  <div>
                    <span className="text-muted-foreground">Categoria:</span> {book.categoryName}
                  </div>
                )}
                {book.publishedYear && (
                  <div>
                    <span className="text-muted-foreground">Ano:</span> {book.publishedYear}
                  </div>
                )}
                {book.description && (
                  <p className="line-clamp-3 text-muted-foreground">{book.description}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setSelectedBook(book)}
              >
                <BookOpenIcon className="size-4" />
                Detalhes
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleReserve(book.id)}
                disabled={book.availableCopies === 0 || createReservation.isPending}
              >
                <BookmarkIcon className="size-4" />
                Reservar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {isFetchingNextPage && <Spinner className="size-6" />}
        </div>
      )}

      {/* Show message when all books are loaded */}
      {!hasNextPage && filteredBooks.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Todos os livros foram carregados</p>
        </div>
      )}

      {selectedBook && (
        <BookDetailsDialog
          book={selectedBook}
          open={!!selectedBook}
          onOpenChange={() => setSelectedBook(null)}
        />
      )}
    </>
  )
}
