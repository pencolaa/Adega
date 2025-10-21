import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Table2, TrendingUp, AlertCircle, DollarSign } from "lucide-react"

// Mock data - será substituído por dados reais
const dashboardData = {
  totalProdutos: 45,
  produtosBaixoEstoque: 8,
  totalClientes: 156,
  totalFuncionarios: 12,
  mesasOcupadas: 8,
  mesasDisponiveis: 12,
  vendasHoje: 2450.0,
  vendasMes: 45780.0,
}

const produtosBaixoEstoque = [
  { nome: "Espumante Brut", estoque: 8 },
  { nome: "Cerveja Stout", estoque: 5 },
  { nome: "Vinho Rosé", estoque: 7 },
  { nome: "Gin Premium", estoque: 3 },
]

const mesasOcupadas = [
  { numero: 1, clientes: 4, horario: "19:30" },
  { numero: 3, clientes: 2, horario: "20:00" },
  { numero: 5, clientes: 6, horario: "19:45" },
  { numero: 8, clientes: 3, horario: "20:15" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema de gestão da adega</p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dashboardData.totalProdutos}</div>
              <p className="text-xs text-primary mt-1">{dashboardData.produtosBaixoEstoque} com baixo estoque</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Cadastrados</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dashboardData.totalClientes}</div>
              <p className="text-xs text-muted-foreground mt-1">+12 este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mesas</CardTitle>
              <Table2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.mesasOcupadas}/{dashboardData.mesasOcupadas + dashboardData.mesasDisponiveis}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ocupadas agora</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vendas do Mês</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {dashboardData.vendasMes.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-primary mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +15% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produtos com baixo estoque */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Produtos com Baixo Estoque</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Produtos que precisam de reposição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {produtosBaixoEstoque.map((produto, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <span className="text-foreground font-medium">{produto.nome}</span>
                    <span className="text-primary font-bold">{produto.estoque} unidades</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mesas ocupadas */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Table2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Mesas Ocupadas</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Status atual das mesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mesasOcupadas.map((mesa, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <div>
                      <span className="text-foreground font-medium">Mesa {mesa.numero}</span>
                      <p className="text-sm text-muted-foreground">{mesa.clientes} clientes</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{mesa.horario}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
