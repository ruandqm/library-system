"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { trpc } from "@/lib/trpc"

interface BookSearchProps {
  onSearchChange?: (query: string) => void
  onCategoryChange?: (categoryId: string | null) => void
}

export function BookSearch({ onSearchChange, onCategoryChange }: BookSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const { data: categories } = trpc.category.getAll.useQuery()

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleCategoryChange = (value: string) => {
    const newCategoryId = value === "all" ? null : value
    setCategoryId(newCategoryId)
    onCategoryChange?.(newCategoryId)
  }

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Pesquise por título, autor ou ISBN..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={categoryId || "all"} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
