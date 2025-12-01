"use client";

import { JSX, useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { AddProductDialog } from "@/components/add-product-dialog";
import { Wine, Beer, Coffee, UtensilsCrossed, ShoppingBag, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditProductDialog } from "@/components/edit-product-dialog";
import { ProductAvailabilityToggle } from "@/components/product-availability-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string;
  quantity: number;
  isAvailable: boolean;
}

interface MenuItem {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await res.json();
      setProducts(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Agrupa produtos por categoria
  const groupByCategory = (products: Product[]) => {
    const grouped: Record<string, MenuItem[]> = {};

    products.forEach((product) => {
      const category = product.category || "outros";
      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({
        id: product.id,
        nome: product.name,
        descricao: product.description || "Sem descrição",
        preco: parseFloat(product.price),
        estoque: product.quantity,
      });
    });

    return grouped;
  };

  const categorizedProducts = groupByCategory(products);

  // Ícones por categoria
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      pizzas: <UtensilsCrossed className="w-6 h-6" />,
      lanches: <ShoppingBag className="w-6 h-6" />,
      bebidas: <Beer className="w-6 h-6" />,
      "bebidas quentes": <Coffee className="w-6 h-6" />,
      sobremesas: <Wine className="w-6 h-6" />,
      acompanhamentos: <UtensilsCrossed className="w-6 h-6" />,
      massas: <UtensilsCrossed className="w-6 h-6" />,
      saladas: <UtensilsCrossed className="w-6 h-6" />,
    };
    return icons[category.toLowerCase()] || <ShoppingBag className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold text-foreground text-balance">
              Cardápio da Adega
            </h1>
            <AddProductDialog onProductAdded={fetchProducts} />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(categorizedProducts).map(([category, items]) => (
          <CardapioSection
            key={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            icon={getCategoryIcon(category)}
            items={items}
            products={products.filter((p) => p.category === category)}
            onUpdate={fetchProducts}
          />
        ))}

        {Object.keys(categorizedProducts).length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nenhum produto disponível no momento.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Adega. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface CardapioSectionProps {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  products?: Product[];
  onUpdate?: () => void;
}

export function CardapioSection({
  title,
  icon,
  items,
  products = [],
  onUpdate,
}: CardapioSectionProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (productId: number) => {
    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao deletar produto");
      }

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar produto. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-red-600">{icon}</div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return (
            <Card key={item.id} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {item.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.descricao}
                    </p>
                  </div>
                  {product && onUpdate && (
                    <div className="flex gap-1">
                      <EditProductDialog
                        product={product}
                        onProductUpdated={onUpdate}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingId === product.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{product.name}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">
                    R$ {item.preco.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Estoque: {item.estoque}
                  </span>
                </div>

                {product && onUpdate && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <ProductAvailabilityToggle
                      productId={product.id}
                      productName={product.name}
                      isAvailable={product.isAvailable}
                      onToggle={onUpdate}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
