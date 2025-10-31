"use client";

import Head from "next/head";
import { useComanda } from "@/context/comanda-context"; // Nosso hook da comanda
import { ComandaSheet } from "@/components/ui/comanda-sheet"; // Nosso carrinho
import { Wine, Beer, Coffee, UtensilsCrossed } from "lucide-react"; // Ícones do seu novo arquivo

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

// 1. COPIANDO OS DADOS DO ARQUIVO QUE VOCÊ ENVIOU
const menuData = {
  vinhos: [
    { id: 1, nome: "Vinho Tinto Reserva", descricao: "Cabernet Sauvignon, safra 2020", preco: 89.9, estoque: 15 },
    { id: 2, nome: "Vinho Branco Seco", descricao: "Chardonnay, safra 2021", preco: 75.0, estoque: 20 },
    { id: 3, nome: "Vinho Rosé", descricao: "Merlot Rosé, safra 2022", preco: 65.0, estoque: 12 },
    { id: 4, nome: "Espumante Brut", descricao: "Método tradicional", preco: 95.0, estoque: 8 },
  ],
  cervejas: [
    { id: 5, nome: "Cerveja Artesanal IPA", descricao: "American IPA, 500ml", preco: 18.0, estoque: 30 },
    { id: 6, nome: "Cerveja Pilsen", descricao: "Pilsen clássica, 350ml", preco: 12.0, estoque: 50 },
    { id: 7, nome: "Cerveja Stout", descricao: "Imperial Stout, 500ml", preco: 22.0, estoque: 15 },
  ],
  drinks: [
    { id: 8, nome: "Caipirinha", descricao: "Limão, cachaça artesanal", preco: 18.0, estoque: 100 },
    { id: 9, nome: "Gin Tônica", descricao: "Gin premium, tônica, limão siciliano", preco: 25.0, estoque: 100 },
    { id: 10, nome: "Negroni", descricao: "Gin, Campari, vermute", preco: 28.0, estoque: 100 },
  ],
  petiscos: [
    { id: 11, nome: "Tábua de Frios", descricao: "Queijos, salames, azeitonas", preco: 45.0, estoque: 20 },
    { id: 12, nome: "Bruschetta", descricao: "Tomate, manjericão, azeite", preco: 22.0, estoque: 30 },
    { id: 13, nome: "Porção de Azeitonas", descricao: "Mix de azeitonas temperadas", preco: 15.0, estoque: 40 },
  ],
};

// 2. CRIANDO UMA ESTRUTURA PARA AS SEÇÕES (Como no seu arquivo)
const categorias = [
  {
    title: "Vinhos",
    icon: <Wine className="mr-2 h-6 w-6" />,
    items: menuData.vinhos,
  },
  {
    title: "Cervejas Artesanais",
    icon: <Beer className="mr-2 h-6 w-6" />,
    items: menuData.cervejas,
  },
  {
    title: "Drinks",
    icon: <Coffee className="mr-2 h-6 w-6" />, // No seu arquivo era Coffee, podemos mudar se quiser
    items: menuData.drinks,
  },
  {
    title: "Petiscos",
    icon: <UtensilsCrossed className="mr-2 h-6 w-6" />,
    items: menuData.petiscos,
  },
];

// 3. FUNÇÃO HELPER PARA CONVERTER O PREÇO (Número -> String R$)
const formatPreco = (preco: number): string => {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function CardapioCliente() {
  // Pegando a função 'adicionarItem' do nosso contexto
  const { adicionarItem } = useComanda();

  // Função para lidar com o clique
  const handleAddItem = (item: { nome: string; descricao: string; preco: number }) => {
    // 4. Converte o item para o formato que o Contexto espera
    const itemParaComanda = {
      nome: item.nome,
      desc: item.descricao,
      preco: formatPreco(item.preco), // Converte 89.9 para "R$ 89,90"
    };
    adicionarItem(itemParaComanda);
  };

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

          {/* 5. RENDERIZAÇÃO DAS NOVAS SEÇÕES */}
          <main className="mt-10 space-y-12">
            {categorias.map((categoria) => (
              <section key={categoria.title}>
                <h3 className="flex items-center text-3xl font-semibold text-white">
                  {categoria.icon}
                  {categoria.title}
                </h3>
                <Separator className="my-4 bg-zinc-800" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {categoria.items.map((item) => (
                    <Card
                      key={item.id}
                      className="flex flex-col justify-between border-zinc-800 bg-zinc-900"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-white">
                          {item.nome}
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                          {item.descricao}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">
                          {formatPreco(item.preco)}
                        </span>
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          // 6. AÇÃO DE ADICIONAR ITEM
                          onClick={() => handleAddItem(item)}
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

        {/* 7. O CARRINHO (COMANDA SHEET) CONTINUA AQUI */}
        <ComandaSheet />
      </div>
    </>
  );
}