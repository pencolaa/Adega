"use client";

// Importa os componentes do shadcn/ui que você tem
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Importa o hook do contexto que acabamos de criar
import { useComanda } from "@/context/comanda-context";

// Importa os ícones que você tem no package.json (lucide-react)
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

// Função para formatar o preço de volta para R$ (Ex: 120.5 => "R$ 120,50")
const formatPreco = (preco: number) => {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function ComandaSheet() {
  // Pega todos os dados e funções do nosso contexto
  const { itens, adicionarItem, removerItem, totalItens, totalPreco } =
    useComanda();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* Este é o botão flutuante do carrinho */}
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full border-zinc-700 bg-zinc-900 shadow-lg hover:bg-zinc-800"
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {/* Badge vermelha com o total de itens */}
          {totalItens > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {totalItens}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      {/* Este é o conteúdo que aparece quando o carrinho é aberto */}
      <SheetContent className="flex flex-col border-l-zinc-800 bg-zinc-950 text-zinc-50">
        <SheetHeader>
          <SheetTitle className="text-2xl text-white">
            Minha Comanda
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4 bg-zinc-800" />
        
        {/* Verifica se a comanda está vazia */}
        {itens.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-zinc-400">Sua comanda está vazia.</p>
          </div>
        ) : (
          // Lista os itens da comanda
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {itens.map((item) => (
                <div
                  key={item.nome}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{item.nome}</p>
                    <p className="text-sm text-red-600">{item.preco}</p>
                  </div>
                  {/* Botões de + e - */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-zinc-700 bg-zinc-900"
                      onClick={() => removerItem(item.nome)}
                    >
                      {/* Mostra o ícone de lixo se for o último item */}
                      {item.quantidade === 1 ? (
                        <Trash2 className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="w-6 text-center">{item.quantidade}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-zinc-700 bg-zinc-900"
                      onClick={() => adicionarItem(item)} // Re-usa a função adicionar
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Rodapé do carrinho */}
        <Separator className="my-4 bg-zinc-800" />
        <SheetFooter className="flex-col space-y-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="text-zinc-300">Total:</span>
            <span className="text-red-600">{formatPreco(totalPreco)}</span>
          </div>
          <SheetClose asChild>
            <Button
              className="w-full bg-red-600 text-white hover:bg-red-700"
              disabled={itens.length === 0}
            >
              Confirmar Pedido
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}