// app/login/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios, { isAxiosError } from 'axios'; // Importação correta

// Importações dos seus componentes UI (sem mudança)
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
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Fazer a requisição para sua API
      const response = await axios.post(
        // CORREÇÃO 1: Usando a variável de ambiente
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, 
        {
          email: email,
          password: password,
        }
      );

      // 2. Salvar o token
      const { token } = response.data;
      localStorage.setItem('token', token);

      // 3. Redirecionar para a página /admin/cardapio
      router.push('/admin/cardapio');

    } catch (err) {
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';

      if (isAxiosError(err)) {
        // CORREÇÃO 2: Seu backend envia 'message', não 'msg'
        errorMessage = err.response?.data?.message || 'Credenciais inválidas ou erro no servidor.';
      }
    
      setError(errorMessage);
    } finally {
      // 5. Parar o estado de carregamento
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#18181B] p-6 text-white">
      <Card className="w-full max-w-sm border-none bg-zinc-900 text-white shadow-lg shadow-black/20">
        <CardHeader className="items-center text-center">
          {/* Logo (sem mudança) */}
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
            {/* Campo de Email */}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  id="password" 
                  name="password" 
                  className="pr-12"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Exibição da Mensagem de Erro */}
            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            {/* Opções (sem mudança) */}
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

            {/* Botão de Entrar */}
            <Button
              type="submit"
              className="w-full bg-red-600 text-base font-semibold text-white hover:bg-red-700"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rodapé (sem mudança) */}
      <footer className="absolute bottom-0 w-full py-5 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Capone. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}