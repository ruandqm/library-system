import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(value: string) {
  if (!value) return ""
  value = value.replace(/\D/g, "")
  value = value.substring(0, 11)
  if (value.length > 10) {
    return value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3")
  } else if (value.length > 5) {
    return value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3")
  } else if (value.length > 2) {
    return value.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2")
  } else {
    return value.replace(/^(\d*)/, "($1")
  }
}

export function translateRole(role: string): string {
  const roleMap: Record<string, string> = {
    MEMBER: "Membro",
    LIBRARIAN: "Bibliotecário",
  }
  return roleMap[role] || role
}

export function translateBookStatus(status: string): string {
  const statusMap: Record<string, string> = {
    AVAILABLE: "Disponível",
    BORROWED: "Emprestado",
    RESERVED: "Reservado",
  }
  return statusMap[status] || status
}
