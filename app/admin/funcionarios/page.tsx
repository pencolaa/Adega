"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, UserCog, Mail, Phone } from "lucide-react"
import { FuncionarioDialog } from "@/components/funcionario-dialog"

interface Funcionario {
  id: number
  nome: string
  email: string
  telefone: string
  cargo: string
  dataAdmissao: string
  salario: number
  status: "ativo" | "inativo"
}

// Mock data inicial
const funcionariosIniciais: Funcionario[] = [
  {
    id: 1,
    nome: "Carlos Mendes",
    email: "carlos.mendes@adega.com",
    telefone: "(11) 91234-5678",
    cargo: "Gerente",
    dataAdmissao: "2023-01-10",
    salario: 5500.0,
    status: "ativo",
  },
  {
    id: 2,
    nome: "Fernanda Lima",
    email: "fernanda.lima@adega.com",
    telefone: "(11) 92345-6789",
    cargo: "Sommelier",
    dataAdmissao: "2023-03-15",
    salario: 4200.0,
    status: "ativo",
  },
  {
    id: 3,
    nome: "Roberto Santos",
    email: "roberto.santos@adega.com",
    telefone: "(11) 93456-7890",
    cargo: "Garçom",
    dataAdmissao: "2023-06-20",
    salario: 2800.0,
    status: "ativo",
  },
  {
    id: 4,
    nome: "Juliana Costa",
    email: "juliana.costa@adega.com",
    telefone: "(11) 94567-8901",
    cargo: "Cozinheira",
    dataAdmissao: "2023-08-05",
    salario: 3200.0,
    status: "ativo",
  },
]

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(funcionariosIniciais)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null)

  const filteredFuncionarios = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddFuncionario = (funcionario: Omit<Funcionario, "id">) => {
    const newFuncionario = {
      ...funcionario,
      id: Math.max(...funcionarios.map((f) => f.id), 0) + 1,
    }
    setFuncionarios([...funcionarios, newFuncionario])
    setDialogOpen(false)
  }

  const handleEditFuncionario = (funcionario: Funcionario) => {
    setFuncionarios(funcionarios.map((f) => (f.id === funcionario.id ? funcionario : f)))
    setDialogOpen(false)
    setEditingFuncionario(null)
  }

  const handleDeleteFuncionario = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id))
    }
  }

  const openEditDialog = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario)
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingFuncionario(null)
    setDialogOpen(true)
  }

  const funcionariosAtivos = funcionarios.filter((f) => f.status === "ativo").length
  const totalFolhaPagamento = funcionarios.filter((f) => f.status === "ativo").reduce((acc, f) => acc + f.salario, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Funcionários</h1>
            <p className="text-muted-foreground">Cadastro e controle de equipe</p>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Funcionário
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Funcionários</p>
                  <p className="text-2xl font-bold text-foreground">{funcionarios.length}</p>
                </div>
                <UserCog className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Funcionários Ativos</p>
                  <p className="text-2xl font-bold text-primary">{funcionariosAtivos}</p>
                </div>
                <UserCog className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Folha de Pagamento</p>
                  <p className="text-2xl font-bold text-foreground">R$ {totalFolhaPagamento.toLocaleString("pt-BR")}</p>
                </div>
                <UserCog className="w-8 h-8 text-primary" />
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
                placeholder="Buscar funcionários por nome, cargo ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de funcionários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFuncionarios.map((funcionario) => (
            <Card key={funcionario.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-foreground">{funcionario.nome}</CardTitle>
                      <Badge variant={funcionario.status === "ativo" ? "default" : "secondary"}>
                        {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="mb-2">
                      {funcionario.cargo}
                    </Badge>
                    <div className="space-y-1">
                      <CardDescription className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {funcionario.email}
                      </CardDescription>
                      <CardDescription className="text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {funcionario.telefone}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Admissão:</span>
                    <span className="text-foreground">
                      {new Date(funcionario.dataAdmissao).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Salário:</span>
                    <span className="text-lg font-bold text-primary">R$ {funcionario.salario.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(funcionario)}
                      className="flex-1 border-border hover:bg-secondary"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFuncionario(funcionario.id)}
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

        {filteredFuncionarios.length === 0 && (
          <div className="text-center py-12">
            <UserCog className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
          </div>
        )}
      </main>

      <FuncionarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        funcionario={editingFuncionario}
        onSave={editingFuncionario ? handleEditFuncionario : handleAddFuncionario}
      />
    </div>
  )
}
