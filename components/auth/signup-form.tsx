"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const signup = trpc.user.signup.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso! Você pode fazer login agora.",
      });
      router.push("/auth/signin");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    signup.mutate({
      name,
      email,
      password,
      phone: phone || undefined,
      address: address || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome completo *</Label>
        <Input
          id="name"
          type="text"
          placeholder="João Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          placeholder="joao@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirmar senha *</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Digite a senha novamente"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+55 (11) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          type="text"
          placeholder="Rua, número, cidade, estado"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={signup.isPending} className="w-full">
        {signup.isPending ? "Criando conta..." : "Criar conta"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Fazer login
        </Link>
      </div>
    </form>
  );
}

