"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Users, Mail, Phone } from "lucide-react"
import { ClienteDialog } from "@/components/cliente-dialog"

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  cpf: string
  dataCadastro: string
  totalCompras: number
}

// Mock data inicial
const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    dataCadastro: "2024-01-15",
    totalCompras: 1250.0,
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 97654-3210",
    cpf: "987.654.321-00",
    dataCadastro: "2024-02-20",
    totalCompras: 890.5,
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    telefone: "(11) 96543-2109",
    cpf: "456.789.123-00",
    dataCadastro: "2024-03-10",
    totalCompras: 2340.0,
  },
  {
    id: 4,
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    telefone: "(11) 95432-1098",
    cpf: "321.654.987-00",
    dataCadastro: "2024-03-25",
    totalCompras: 560.0,
  },
]

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm),
  )

  const handleAddCliente = (cliente: Omit<Cliente, "id">) => {
    const newCliente = {
      ...cliente,
      id: Math.max(...clientes.map((c) => c.id), 0) + 1,
    }
    setClientes([...clientes, newCliente])
    setDialogOpen(false)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setClientes(clientes.map((c) => (c.id === cliente.id ? cliente : c)))
    setDialogOpen(false)
    setEditingCliente(null)
  }

  const handleDeleteCliente = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id))
    }
  }

  const openEditDialog = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingCliente(null)
    setDialogOpen(true)
  }

  const totalComprasGeral = clientes.reduce((acc, cliente) => acc + cliente.totalCompras, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Clientes</h1>
            <p className="text-muted-foreground">Cadastro e histórico de clientes</p>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{clientes.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Novos este Mês</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total em Compras</p>
                  <p className="text-2xl font-bold text-foreground">R$ {totalComprasGeral.toLocaleString("pt-BR")}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar clientes por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground mb-2">{cliente.nome}</CardTitle>
                    <div className="space-y-1">
                      <CardDescription className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {cliente.email}
                      </CardDescription>
                      <CardDescription className="text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {cliente.telefone}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">CPF: {cliente.cpf}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cadastro:</span>
                    <span className="text-foreground">
                      {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total em Compras:</span>
                    <span className="text-lg font-bold text-primary">R$ {cliente.totalCompras.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(cliente)}
                      className="flex-1 border-border hover:bg-secondary"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCliente(cliente.id)}
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

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
      </main>

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={editingCliente}
        onSave={editingCliente ? handleEditCliente : handleAddCliente}
      />
    </div>
  )
}
