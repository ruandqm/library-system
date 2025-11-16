"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, UsersIcon, BookMarkedIcon, CalendarIcon, LogOutIcon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminNavProps {
  user: {
    name?: string | null
    email?: string | null
    role: string
  }
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Painel", icon: BookOpenIcon },
    { href: "/admin/books", label: "Livros", icon: BookMarkedIcon },
    { href: "/admin/loans", label: "Empréstimos", icon: CalendarIcon },
    ...(user.role === "ADMIN" ? [{ href: "/admin/users", label: "Usuários", icon: UsersIcon }] : []),
  ]

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <BookOpenIcon className="size-6" />
            <span>Administração da Biblioteca</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    pathname === item.href ? "bg-muted" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="text-sm text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.role}</p>
              </div>
              <UserIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="flex items-center gap-2">
                <UserIcon className="size-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/signin" })} className="text-destructive">
              <LogOutIcon className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
