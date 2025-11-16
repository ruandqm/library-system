"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Pesquise por título, autor ou ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          <SelectItem value="fiction">Ficção</SelectItem>
          <SelectItem value="non-fiction">Não-ficção</SelectItem>
          <SelectItem value="science">Ciência</SelectItem>
          <SelectItem value="history">História</SelectItem>
          <SelectItem value="technology">Tecnologia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
