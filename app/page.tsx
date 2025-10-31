"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react"; // Ícone de carregamento padrão do shadcn/ui

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simula um tempo de carregamento de 3 segundos
    const timer = setTimeout(() => {
      // Redireciona para a página de check-in que acabamos de mover
      router.push("/clients/login-clientes");
    }, 3000); // 3000ms = 3 segundos

    // Limpa o timer se o usuário sair da página
    return () => clearTimeout(timer);
  }, [router]);

  return (
    // Container principal: tela cheia, centralizado, fundo escuro
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-950 text-zinc-50">
      <div className="flex flex-col items-center gap-6">
        {/* 1. SEU LOGO */}
        <Image
          // IMPORTANTE: Seu logo deve estar na pasta 'public/'
          src="/caponelogo.jpg"
          alt="Logo CAPONE"
          width={250} // Ajuste o tamanho (largura)
          height={250} // Ajuste o tamanho (altura)
          
          // Animação de pulsação sutil
          className="animate-pulse" 
          
          // 'priority' faz o Next.js carregar a logo primeiro
          priority 
        />

        {/* 2. ANIMAÇÃO DE CARREGAMENTO (Spinner) */}
        <div className="flex items-center gap-3 text-zinc-400">
          {/* Ícone giratório com a cor vermelha do tema */}
          <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          <span className="text-lg">Carregando...</span>
        </div>
      </div>
    </div>
  );
}