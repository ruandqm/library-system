"use client";

import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpenIcon, BookmarkIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BookDetailsDialog } from "./book-details-dialog";
import type { Book } from "@/domain/entities/book.entity";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function BooksGrid() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: books, isLoading } = trpc.book.getAll.useQuery();

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Livro reservado com sucesso",
      });
      utils.reservation.getMyReservations.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReserve = (bookId: string) => {
    createReservation.mutate({ bookId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpenIcon className="size-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Nenhum livro disponível</p>
        <p className="text-sm text-muted-foreground">
          Volte mais tarde para novas adições
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col" data-testid="book-card">
            <CardHeader>
              <div className="mb-2 flex items-start justify-between">
                <Badge
                  variant={book.availableCopies > 0 ? "default" : "secondary"}
                >
                  {book.availableCopies > 0 ? "Disponível" : "Indisponível"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {book.availableCopies}/{book.totalCopies} cópias
                </span>
              </div>
              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="line-clamp-1">
                {book.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <AspectRatio
                ratio={3 / 4}
                className="mb-4 overflow-hidden rounded-md bg-muted"
              >
                <img
                  src={book.coverImage || "/placeholder.jpg"}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </AspectRatio>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Categoria:</span>{" "}
                  {book.category}
                </div>
                {book.publishedYear && (
                  <div>
                    <span className="text-muted-foreground">Ano:</span>{" "}
                    {book.publishedYear}
                  </div>
                )}
                {book.description && (
                  <p className="line-clamp-3 text-muted-foreground">
                    {book.description}
                  </p>
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
                disabled={
                  book.availableCopies === 0 || createReservation.isPending
                }
              >
                <BookmarkIcon className="size-4" />
                Reservar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedBook && (
        <BookDetailsDialog
          book={selectedBook}
          open={!!selectedBook}
          onOpenChange={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}
