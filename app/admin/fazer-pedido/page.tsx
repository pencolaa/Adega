"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingCart } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Mesa {
  id: number
  numero: number
  capacidade: number
  status: "disponivel" | "ocupada" | "reservada"
  clientes?: number
  horarioOcupacao?: string
  nomeReserva?: string
}

interface Produto {
  id: number
  nome: string
  preco: number
}

const mesasIniciais: Mesa[] = [
  { id: 1, numero: 1, capacidade: 4, status: "ocupada", clientes: 4, horarioOcupacao: "19:30" },
  { id: 2, numero: 2, capacidade: 2, status: "disponivel" },
  { id: 3, numero: 3, capacidade: 2, status: "ocupada", clientes: 2, horarioOcupacao: "20:00" },
  { id: 4, numero: 4, capacidade: 6, status: "reservada", nomeReserva: "João Silva" },
  { id: 5, numero: 5, capacidade: 6, status: "ocupada", clientes: 6, horarioOcupacao: "19:45" },
]

const produtosMock: Produto[] = [
  { id: 1, nome: "Cerveja Heineken 600ml", preco: 12.0 },
  { id: 2, nome: "Porção de Batata", preco: 25.0 },
  { id: 3, nome: "Refrigerante Lata", preco: 7.0 },
  { id: 4, nome: "Caipirinha", preco: 15.0 },
  { id: 5, nome: "Porção de Calabresa", preco: 28.0 },
]

export default function FazerPedidoPage() {
  const [mesas] = useState<Mesa[]>(mesasIniciais)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null)
  const [pedido, setPedido] = useState<Produto[]>([])

  const abrirDialog = (mesa: Mesa) => {
    setMesaSelecionada(mesa)
    setDialogOpen(true)
    setPedido([])
  }

  const adicionarProduto = (produto: Produto) => setPedido([...pedido, produto])
  const removerProduto = (id: number) => setPedido(pedido.filter((p) => p.id !== id))
  const total = pedido.reduce((acc, item) => acc + item.preco, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "ocupada":
        return "bg-primary/10 text-primary border-primary/20"
      case "reservada":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Fazer Pedido</h1>
          <p className="text-muted-foreground">Selecione uma mesa para registrar um pedido</p>
        </div>

        {/* Grid de mesas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mesas.map((mesa) => (
            <Card
              key={mesa.id}
              className={`bg-card border-2 transition-all cursor-pointer hover:scale-105 ${
                mesa.status === "disponivel"
                  ? "border-green-500/30 hover:border-green-500"
                  : mesa.status === "ocupada"
                  ? "border-primary/30 hover:border-primary"
                  : "border-yellow-500/30 hover:border-yellow-500"
              }`}
              onClick={() => abrirDialog(mesa)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl text-foreground">Mesa {mesa.numero}</CardTitle>
                  <Badge className={getStatusColor(mesa.status)} variant="outline">
                    {mesa.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3 h-3" /> {mesa.capacidade} lugares
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      {/* Dialog de pedido */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Pedido - Mesa {mesaSelecionada?.numero}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Cardápio */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Cardápio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {produtosMock.map((produto) => (
                  <Button
                    key={produto.id}
                    variant="outline"
                    onClick={() => adicionarProduto(produto)}
                    className="justify-between"
                  >
                    <span>{produto.nome}</span>
                    <span className="text-sm text-muted-foreground">R$ {produto.preco.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
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
                      key={item.id}
                      className="flex items-center justify-between text-sm border-b border-border pb-1"
                    >
                      <span>{item.nome}</span>
                      <div className="flex items-center gap-2">
                        <span>R$ {item.preco.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removerProduto(item.id)}
                          className="text-destructive"
                        >
                          Remover
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum item adicionado.</p>
              )}
            </section>

            {/* Total e finalizar */}
            <div className="flex justify-between items-center pt-2 border-t border-border mt-2 sticky bottom-0 bg-background py-3">
              <p className="font-semibold">Total: R$ {total.toFixed(2)}</p>
              <Button disabled={pedido.length === 0} className="bg-primary text-white">
                Finalizar Pedido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
