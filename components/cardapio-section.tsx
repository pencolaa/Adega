// components/cardapio-section.tsx
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Presumindo que você tem o componente Card

// 1. Definição das interfaces que o componente espera
interface Item {
  id: number;
  nome: string;
  descricao: string;
  preco: number; // Seu mock data usa número
  estoque: number;
}

interface CardapioSectionProps {
  title: string;
  icon: ReactNode;
  items: Item[];
}

// 2. Função para formatar o preço para R$
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// 3. O componente
export function CardapioSection({ title, icon, items }: CardapioSectionProps) {
  return (
    <section className="mb-12">
      {/* Título da Seção (Vinhos, Cervejas, etc.) */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-primary">{icon}</span> {/* Ícone vermelho */}
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      </div>

      {/* Grid com os Cards dos produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="bg-card flex flex-col justify-between shadow-lg">
            
            {/* Nome e Descrição */}
            <CardHeader>
              <CardTitle className="text-foreground">{item.nome}</CardTitle>
              <CardDescription>{item.descricao}</CardDescription>
            </CardHeader>
            
            {/* Preço */}
            <CardContent>
              
              {/* ↓↓↓ ALTERAÇÃO FEITA AQUI ↓↓↓ 
                - Removida a classe de contorno [-webkit-text-stroke]
                - O preço agora será apenas branco (ou a cor 'foreground' do seu tema)
              */}
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(item.preco)}
              </span>
              
            </CardContent>

            {/* Estoque */}
            <CardFooter>
              <span className="text-sm text-muted-foreground">
                Estoque: {item.estoque}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}