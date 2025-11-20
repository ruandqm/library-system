"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Erro",
          description: "E-mail ou senha inválidos",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@biblioteca.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Criar conta
        </Link>
      </div>
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">Contas de demonstração:</p>
        <p>Bibliotecário: librarian@library.com / librarian123</p>
        <p>Membro: member@library.com / member123</p>
      </div>
    </form>
  );
}
