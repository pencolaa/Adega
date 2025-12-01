"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Mesa {
  id: string;
  label: string;
  seats: number;
  status: "available" | "busy" | "reserved";
  tipo: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lock: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string;
  quantity: number;
  isAvailable: boolean;
}

interface PedidoItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

export default function FazerPedidoPage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [pedido, setPedido] = useState<PedidoItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mesasRes, productsRes] = await Promise.all([
        fetch("/api/tables"),
        fetch("/api/products"),
      ]);

      if (mesasRes.ok) {
        const mesasData = await mesasRes.json();
        setMesas(mesasData);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        // Filtra apenas produtos disponíveis
        setProducts(productsData.filter((p: Product) => p.isAvailable));
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirDialog = (mesa: Mesa) => {
    setMesaSelecionada(mesa);
    setDialogOpen(true);
    setPedido([]);
    setCustomerName("");
  };

  const adicionarProduto = (produto: Product) => {
    const itemExistente = pedido.find((p) => p.productId === produto.id);

    if (itemExistente) {
      // Incrementa quantidade se já existe
      setPedido(
        pedido.map((p) =>
          p.productId === produto.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      // Adiciona novo item
      setPedido([
        ...pedido,
        {
          productId: produto.id,
          quantity: 1,
          name: produto.name,
          price: parseFloat(produto.price),
        },
      ]);
    }
  };

  const removerProduto = (productId: number) => {
    const item = pedido.find((p) => p.productId === productId);
    
    if (item && item.quantity > 1) {
      // Decrementa quantidade
      setPedido(
        pedido.map((p) =>
          p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    } else {
      // Remove item completamente
      setPedido(pedido.filter((p) => p.productId !== productId));
    }
  };

  const finalizarPedido = async () => {
    if (!mesaSelecionada || pedido.length === 0 || !customerName.trim()) {
      alert("Preencha o nome do cliente e adicione pelo menos um item ao pedido.");
      return;
    }

    setSubmitting(true);

    try {
      // Prepara os itens do pedido no formato esperado pelo backend
      const items = pedido.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          tableId: mesaSelecionada.id,
          items: items,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao criar pedido");
      }

      const data = await res.json();
      
      alert(`Pedido #${data.id} criado com sucesso para ${customerName}!`);
      setDialogOpen(false);
      setPedido([]);
      setCustomerName("");
      fetchData(); // Atualiza a lista de mesas
    } catch (error: any) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao criar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = pedido.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "busy":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "reserved":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "busy":
        return "Ocupada";
      case "reserved":
        return "Reservada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Fazer Pedido
          </h1>
          <p className="text-muted-foreground">
            Selecione uma mesa para registrar um pedido
          </p>
        </div>

        {/* Grid de mesas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mesas.map((mesa) => (
            <Card
              key={mesa.id}
              className={`bg-card border-2 transition-all cursor-pointer hover:scale-105 ${
                mesa.status === "available"
                  ? "border-green-500/30 hover:border-green-500"
                  : mesa.status === "busy"
                  ? "border-red-500/30 hover:border-red-500"
                  : "border-yellow-500/30 hover:border-yellow-500"
              }`}
              onClick={() => abrirDialog(mesa)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl text-foreground">
                    {mesa.label}
                  </CardTitle>
                  <Badge
                    className={getStatusColor(mesa.status)}
                    variant="outline"
                  >
                    {getStatusLabel(mesa.status)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3 h-3" /> {mesa.seats} lugares
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {mesas.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nenhuma mesa encontrada.
          </p>
        )}
      </main>

      {/* Dialog de pedido */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Pedido - {mesaSelecionada?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Nome do Cliente */}
            <section>
              <Label htmlFor="customerName" className="text-sm font-medium">
                Nome do Cliente *
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite o nome do cliente"
                className="mt-2"
                required
              />
            </section>

            {/* Cardápio */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Cardápio</h3>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {products.map((produto) => (
                  <Button
                    key={produto.id}
                    variant="outline"
                    onClick={() => adicionarProduto(produto)}
                    className="justify-between h-auto py-3"
                    disabled={produto.quantity === 0}
                  >
                    <div className="text-left">
                      <div className="font-medium">{produto.name}</div>
                      {produto.description && (
                        <div className="text-xs text-muted-foreground">
                          {produto.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Estoque: {produto.quantity}
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      R$ {parseFloat(produto.price).toFixed(2)}
                    </span>
                  </Button>
                ))}
              </div>
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum produto disponível no momento.
                </p>
              )}
            </section>

            {/* Pedido atual */}
            <section className="border-t border-border pt-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Pedido Atual
              </h3>

              {pedido.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {pedido.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between text-sm border-b border-border pb-2"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-xs text-muted-foreground">
                          Qtd: {item.quantity} x R$ {item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removerProduto(item.productId)}
                            className="h-6 px-2"
                          >
                            -
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const produto = products.find(
                                (p) => p.id === item.productId
                              );
                              if (produto) adicionarProduto(produto);
                            }}
                            className="h-6 px-2"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum item adicionado.
                </p>
              )}
            </section>

            {/* Total e finalizar */}
            <div className="flex justify-between items-center pt-2 border-t border-border mt-2 sticky bottom-0 bg-background py-3">
              <p className="font-semibold text-lg">
                Total: R$ {total.toFixed(2)}
              </p>
              <Button
                disabled={pedido.length === 0 || !customerName.trim() || submitting}
                className="bg-primary text-white"
                onClick={finalizarPedido}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  "Finalizar Pedido"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
