"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table2, Users, Clock, CheckCircle2, XCircle } from "lucide-react"
import { MesaDialog } from "@/components/mesa-dialog"

interface Mesa {
  id: number
  numero: number
  capacidade: number
  status: "disponivel" | "ocupada" | "reservada"
  clientes?: number
  horarioOcupacao?: string
  nomeReserva?: string
}

// Mock data inicial
const mesasIniciais: Mesa[] = [
  { id: 1, numero: 1, capacidade: 4, status: "ocupada", clientes: 4, horarioOcupacao: "19:30" },
  { id: 2, numero: 2, capacidade: 2, status: "disponivel" },
  { id: 3, numero: 3, capacidade: 2, status: "ocupada", clientes: 2, horarioOcupacao: "20:00" },
  { id: 4, numero: 4, capacidade: 6, status: "reservada", nomeReserva: "João Silva" },
  { id: 5, numero: 5, capacidade: 6, status: "ocupada", clientes: 6, horarioOcupacao: "19:45" },
  { id: 6, numero: 6, capacidade: 4, status: "disponivel" },
  { id: 7, numero: 7, capacidade: 2, status: "disponivel" },
  { id: 8, numero: 8, capacidade: 4, status: "ocupada", clientes: 3, horarioOcupacao: "20:15" },
  { id: 9, numero: 9, capacidade: 8, status: "disponivel" },
  { id: 10, numero: 10, capacidade: 4, status: "disponivel" },
]

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>(mesasIniciais)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null)

  const mesasDisponiveis = mesas.filter((m) => m.status === "disponivel").length
  const mesasOcupadas = mesas.filter((m) => m.status === "ocupada").length
  const mesasReservadas = mesas.filter((m) => m.status === "reservada").length

  const handleUpdateMesa = (mesaAtualizada: Mesa) => {
    setMesas(mesas.map((m) => (m.id === mesaAtualizada.id ? mesaAtualizada : m)))
    setDialogOpen(false)
    setSelectedMesa(null)
  }

  const handleLiberarMesa = (id: number) => {
    setMesas(
      mesas.map((m) =>
        m.id === id
          ? { ...m, status: "disponivel", clientes: undefined, horarioOcupacao: undefined, nomeReserva: undefined }
          : m,
      ),
    )
  }

  const openMesaDialog = (mesa: Mesa) => {
    setSelectedMesa(mesa)
    setDialogOpen(true)
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "disponivel":
        return <CheckCircle2 className="w-4 h-4" />
      case "ocupada":
        return <XCircle className="w-4 h-4" />
      case "reservada":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível"
      case "ocupada":
        return "Ocupada"
      case "reservada":
        return "Reservada"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Mesas</h1>
          <p className="text-muted-foreground">Controle de ocupação e reservas</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Mesas</p>
                  <p className="text-2xl font-bold text-foreground">{mesas.length}</p>
                </div>
                <Table2 className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-500">{mesasDisponiveis}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ocupadas</p>
                  <p className="text-2xl font-bold text-primary">{mesasOcupadas}</p>
                </div>
                <XCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reservadas</p>
                  <p className="text-2xl font-bold text-yellow-500">{mesasReservadas}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
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
              onClick={() => openMesaDialog(mesa)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl text-foreground">Mesa {mesa.numero}</CardTitle>
                  <Badge className={getStatusColor(mesa.status)} variant="outline">
                    {getStatusIcon(mesa.status)}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {mesa.capacidade} lugares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className={getStatusColor(mesa.status)} variant="outline">
                    {getStatusText(mesa.status)}
                  </Badge>

                  {mesa.status === "ocupada" && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{mesa.clientes} clientes</p>
                      <p>Desde {mesa.horarioOcupacao}</p>
                    </div>
                  )}

                  {mesa.status === "reservada" && (
                    <div className="text-xs text-muted-foreground">
                      <p>{mesa.nomeReserva}</p>
                    </div>
                  )}

                  {mesa.status !== "disponivel" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLiberarMesa(mesa.id)
                      }}
                      className="w-full mt-2 border-border hover:bg-secondary text-xs"
                    >
                      Liberar Mesa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <MesaDialog open={dialogOpen} onOpenChange={setDialogOpen} mesa={selectedMesa} onSave={handleUpdateMesa} />
    </div>
  )
}
