"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner"; // Usando o 'sonner' do seu package.json

// 1. Esta interface é baseada nos dados do seu cardápio
interface ItemCardapio {
  nome: string;
  preco: string; // Ex: "R$ 120,50"
  desc: string;
}

// Interface para o item *dentro* da comanda (com quantidade)
export interface ItemComanda extends ItemCardapio {
  quantidade: number;
}

// Define o que o nosso contexto irá fornecer
interface ComandaContextType {
  itens: ItemComanda[];
  adicionarItem: (item: ItemCardapio) => void;
  removerItem: (nome: string) => void;
  limparComanda: () => void;
  totalItens: number;
  totalPreco: number;
}

// Cria o Contexto
const ComandaContext = createContext<ComandaContextType | undefined>(undefined);

// Função para converter "R$ 120,50" em um número (120.50)
const parsePreco = (preco: string): number => {
  return parseFloat(preco.replace("R$ ", "").replace(".", "").replace(",", "."));
};

// Cria o "Provedor" do contexto
export function ComandaProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemComanda[]>([]);

  // 2. Esta é a função que seu cardápio chama
  const adicionarItem = (item: ItemCardapio) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find((i) => i.nome === item.nome);

      if (itemExistente) {
        // Se já existe, só incrementa a quantidade
        return itensAtuais.map((i) =>
          i.nome === item.nome ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      } else {
        // Se é novo, adiciona com quantidade 1
        return [...itensAtuais, { ...item, quantidade: 1 }];
      }
    });
    toast.success(`${item.nome} adicionado à comanda.`);
  };

  // Função para o carrinho (ComandaSheet)
  const removerItem = (nome: string) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find((i) => i.nome === nome);

      if (itemExistente && itemExistente.quantidade > 1) {
        // Se tem mais de 1, diminui a quantidade
        return itensAtuais.map((i) =>
          i.nome === nome ? { ...i, quantidade: i.quantidade - 1 } : i
        );
      } else {
        // Se só tem 1, remove o item da lista
        return itensAtuais.filter((i) => i.nome !== nome);
      }
    });
    toast.error(`${nome} removido da comanda.`);
  };

  const limparComanda = () => setItens([]);

  // Cálculos para o total (usados no ComandaSheet)
  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const totalPreco = itens.reduce((total, item) => {
    return total + parsePreco(item.preco) * item.quantidade;
  }, 0);

  return (
    <ComandaContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        limparComanda,
        totalItens,
        totalPreco,
      }}
    >
      {children}
    </ComandaContext.Provider>
  );
}

// 3. Este é o hook que sua página do cardápio importa
export function useComanda() {
  const context = useContext(ComandaContext);
  if (context === undefined) {
    throw new Error("useComanda deve ser usado dentro de um ComandaProvider");
  }
  return context;
}