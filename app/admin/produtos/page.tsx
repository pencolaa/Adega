"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { ProdutoDialog } from "@/components/produto-dialog"

interface Produto {
  id: number
  nome: string
  descricao: string
  categoria: string
  preco: number
  estoque: number
}

// Mock data inicial
const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: "Vinho Tinto Reserva",
    descricao: "Cabernet Sauvignon, safra 2020",
    categoria: "Vinhos",
    preco: 89.9,
    estoque: 15,
  },
  {
    id: 2,
    nome: "Vinho Branco Seco",
    descricao: "Chardonnay, safra 2021",
    categoria: "Vinhos",
    preco: 75.0,
    estoque: 20,
  },
  {
    id: 3,
    nome: "Cerveja Artesanal IPA",
    descricao: "American IPA, 500ml",
    categoria: "Cervejas",
    preco: 18.0,
    estoque: 30,
  },
  { id: 4, nome: "Caipirinha", descricao: "Limão, cachaça artesanal", categoria: "Drinks", preco: 18.0, estoque: 100 },
  {
    id: 5,
    nome: "Tábua de Frios",
    descricao: "Queijos, salames, azeitonas",
    categoria: "Petiscos",
    preco: 45.0,
    estoque: 20,
  },
  { id: 6, nome: "Espumante Brut", descricao: "Método tradicional", categoria: "Vinhos", preco: 95.0, estoque: 8 },
]

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduto = (produto: Omit<Produto, "id">) => {
    const newProduto = {
      ...produto,
      id: Math.max(...produtos.map((p) => p.id), 0) + 1,
    }
    setProdutos([...produtos, newProduto])
    setDialogOpen(false)
  }

  const handleEditProduto = (produto: Produto) => {
    setProdutos(produtos.map((p) => (p.id === produto.id ? produto : p)))
    setDialogOpen(false)
    setEditingProduto(null)
  }

  const handleDeleteProduto = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter((p) => p.id !== id))
    }
  }

  const openEditDialog = (produto: Produto) => {
    setEditingProduto(produto)
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingProduto(null)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Produtos</h1>
            <p className="text-muted-foreground">Gerencie o catálogo e controle de estoque</p>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Barra de busca e estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="md:col-span-2 bg-card border-border">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Produtos</p>
                  <p className="text-2xl font-bold text-foreground">{produtos.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Baixo Estoque</p>
                  <p className="text-2xl font-bold text-primary">{produtos.filter((p) => p.estoque < 10).length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground mb-1">{produto.nome}</CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {produto.categoria}
                    </Badge>
                    <CardDescription className="text-muted-foreground">{produto.descricao}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="text-xl font-bold text-primary">R$ {produto.preco.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
                    <span className={`font-bold ${produto.estoque < 10 ? "text-primary" : "text-foreground"}`}>
                      {produto.estoque} unidades
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(produto)}
                      className="flex-1 border-border hover:bg-secondary"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduto(produto.id)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProdutos.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </main>

      <ProdutoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        produto={editingProduto}
        onSave={editingProduto ? handleEditProduto : handleAddProduto}
      />
    </div>
  )
}
