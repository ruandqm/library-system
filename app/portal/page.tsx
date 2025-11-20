"use client"

import { useState } from "react"
import { BooksGrid } from "@/components/portal/books-grid"
import { BookSearch } from "@/components/portal/book-search"

export default function PortalPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryId, setCategoryId] = useState<string | null>(null)

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Explorar Livros</h1>
        <p className="text-muted-foreground">Descubra e reserve livros da nossa coleção</p>
      </div>

      <BookSearch onSearchChange={setSearchQuery} onCategoryChange={setCategoryId} />
      <BooksGrid searchQuery={searchQuery} categoryId={categoryId} />
    </div>
  )
}
