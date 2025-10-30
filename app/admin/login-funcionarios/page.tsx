// app/login/page.tsx
"use client"; // NOVO: Converte para Client Component

import Image from 'next/image';
import Link from 'next/link';
import { User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation'; // NOVO: Importa o router

// NOVAS IMPORTAÇÕES dos seus componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter(); // NOVO: Inicializa o router

  // NOVO: Função para lidar com o envio do formulário
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede que o formulário recarregue a página

    // (Aqui você colocaria sua lógica real de autenticação)

    // Redireciona para a página /cardapio
    router.push('/cardapio');
  };

  return (
    // O fundo principal continua o mesmo
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#18181B] p-6 text-white">
      <Card className="w-full max-w-sm border-none bg-zinc-900 text-white shadow-lg shadow-black/20">
        <CardHeader className="items-center text-center">
          {/* 1. Logo */}
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
          {/* Detalhe da linha vermelha */}
          <div className="pt-2">
            <div className="h-1 w-16 bg-red-600" />
          </div>
        </CardHeader>

        <CardContent>
          {/* 3. Formulário 
              NOVO: Adicionado 'onSubmit' que chama a função handleLogin
          */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Campo de Email com <Label> e <Input> */}
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
                  className="pl-12" // Apenas ajuste de padding para o ícone
                  placeholder="seu.email@capone.com"
                  required
                />
              </div>
            </div>

            {/* Campo de Senha com <Label> e <Input> */}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  id="senha"
                  name="senha"
                  className="pr-12" // Apenas ajuste de padding para o ícone
                  placeholder="••••••••"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 4. Opções com <Checkbox> e <Label> */}
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

            {/* 5. Botão de Entrar com <Button> */}
            <Button
              type="submit" // Mantido como 'submit' para acionar o 'onSubmit' do formulário
              className="w-full bg-red-600 text-base font-semibold text-white hover:bg-red-700"
              size="lg" // Usando props do componente
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rodapé (movido para fora do card, fixo no fim) */}
      <footer className="absolute bottom-0 w-full py-5 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Capone. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}