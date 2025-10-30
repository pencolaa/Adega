"use client";

import Head from "next/head";
import { useComanda } from "@/context/comanda-context"; // Importando nosso hook
import { ComandaSheet } from "@/components/ui/comanda-sheet"; // Importando o Sheet

// Importando os componentes da sua pasta 'ui'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Dados de exemplo (mantidos)
const categorias = [
  {
    nome: "Vinhos Tintos",
    itens: [
      {
        nome: "Capone Reserva Malbec",
        preco: "R$ 120,50",
        desc: "Encorpado, notas de amora e carvalho.",
      },
      // ... outros vinhos
    ],
  },
  {
    nome: "Aperitivos",
    itens: [
      {
        nome: "Bruschetta al Pomodoro",
        preco: "R$ 45,00",
        desc: "Pão italiano, tomates frescos, manjericão.",
      },
      // ... outros aperitivos
    ],
  },
];

export default function Cardapio() {
  // Pegando a função 'adicionarItem' do nosso contexto
  const { adicionarItem } = useComanda();

  return (
    <>
      <Head>
        <title>Cardápio - CAPONE</title>
      </Head>
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-50">
        <div className="container mx-auto max-w-5xl p-4 py-10">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-white">CAPONE</h1>
            <h2 className="text-xl text-zinc-400">Nosso Cardápio</h2>
          </header>

          <main className="mt-10 space-y-12">
            {categorias.map((categoria) => (
              <section key={categoria.nome}>
                <h3 className="text-2xl font-semibold text-white">
                  {categoria.nome}
                </h3>
                <Separator className="my-4 bg-zinc-800" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {categoria.itens.map((item) => (
                    <Card
                      key={item.nome}
                      className="flex flex-col justify-between border-zinc-800 bg-zinc-900"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-white">
                          {item.nome}
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                          {item.desc}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">
                          {item.preco}
                        </span>
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          // AÇÃO ATUALIZADA AQUI
                          onClick={() => adicionarItem(item)}
                        >
                          Adicionar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>

        {/* COMPONENTE DA COMANDA (CARRINHO) ADICIONADO AQUI */}
        <ComandaSheet />
      </div>
    </>
  );
}