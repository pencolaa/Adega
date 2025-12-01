"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 🔑 Importa função de login (caso queira usar a camada de lib)
// import { loginUser } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Chama a rota do Next.js → /api/auth/login → backend Express
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Armazena o token localmente
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redireciona após login bem-sucedido
      router.push("/admin/cardapio");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#18181B] p-6 text-white">
      <Card className="w-full max-w-sm border-none bg-zinc-900 text-white shadow-lg shadow-black/20">
        <CardHeader className="items-center text-center">
          <div className="relative mb-4 h-32 w-32 rounded-full border border-red-600 flex items-center justify-center overflow-hidden">
            <Image
              src="/caponelogo.jpg"
              alt="Capone Adega"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <CardTitle className="text-2xl font-semibold text-white">
            Acesso Exclusivo
          </CardTitle>
          <CardDescription className="text-gray-400">
            Login para funcionários
          </CardDescription>
          <div className="pt-2">
            <div className="h-1 w-16 bg-red-600" />
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className="pl-12"
                  placeholder="seu.email@capone.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  id="senha"
                  name="senha"
                  className="pr-12"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox id="lembrar-me" className="border-gray-600" />
                <Label
                  htmlFor="lembrar-me"
                  className="font-normal text-gray-400"
                >
                  Lembrar-me
                </Label>
              </div>
              <Link
                href="#"
                className="font-medium text-gray-400 underline-offset-4 hover:text-red-500 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 text-base font-semibold text-white hover:bg-red-700"
              size="lg"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {error && (
              <p className="mt-2 text-center text-sm text-red-500">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>

      <footer className="absolute bottom-0 w-full py-5 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Capone. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
