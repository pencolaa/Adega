"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table2, Users, Clock, CheckCircle2, XCircle, Loader2, MapIcon } from "lucide-react";
import { MesaDialog } from "@/components/mesa-dialog";

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

interface MesaFormatada {
  id: string;
  numero: string;
  capacidade: number;
  status: "disponivel" | "ocupada" | "reservada";
}

export default function MesasPage() {
  const router = useRouter();
  const [mesas, setMesas] = useState<MesaFormatada[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<MesaFormatada | null>(null);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tables");
      
      if (!res.ok) {
        throw new Error("Erro ao buscar mesas");
      }

      const data: Mesa[] = await res.json();
      
      // Converte os dados da API para o formato esperado
      const mesasFormatadas: MesaFormatada[] = data.map((mesa) => {
        let status: "disponivel" | "ocupada" | "reservada";
        
        if (mesa.status === "available") {
          status = "disponivel";
        } else if (mesa.status === "busy") {
          status = "ocupada";
        } else {
          status = "reservada";
        }

        return {
          id: mesa.id,
          numero: mesa.label,
          capacidade: mesa.seats,
          status: status,
        };
      });

      setMesas(mesasFormatadas);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
      alert("Erro ao carregar mesas");
    } finally {
      setLoading(false);
    }
  };

  const mesasDisponiveis = mesas.filter((m) => m.status === "disponivel").length;
  const mesasOcupadas = mesas.filter((m) => m.status === "ocupada").length;
  const mesasReservadas = mesas.filter((m) => m.status === "reservada").length;

  const handleUpdateMesa = async (mesaAtualizada: MesaFormatada) => {
    try {
      const statusMap: Record<"disponivel" | "ocupada" | "reservada", "available" | "busy" | "reserved"> = {
        disponivel: "available",
        ocupada: "busy",
        reservada: "reserved",
      };

      const res = await fetch(`/api/tables/${mesaAtualizada.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusMap[mesaAtualizada.status],
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar mesa");
      }

      await fetchMesas();
      setDialogOpen(false);
      setSelectedMesa(null);
      alert("Mesa atualizada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar mesa. Tente novamente.");
    }
  };

  const handleLiberarMesa = async (id: string) => {
    try {
      const res = await fetch(`/api/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "available",
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao liberar mesa");
      }

      await fetchMesas();
      alert("Mesa liberada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao liberar mesa. Tente novamente.");
    }
  };

  const openMesaDialog = (mesa: MesaFormatada) => {
    setSelectedMesa(mesa);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "ocupada":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "reservada":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "disponivel":
        return <CheckCircle2 className="w-4 h-4" />;
      case "ocupada":
        return <XCircle className="w-4 h-4" />;
      case "reservada":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "ocupada":
        return "Ocupada";
      case "reservada":
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Mesas</h1>
            <p className="text-muted-foreground">Controle de ocupação e reservas</p>
          </div>
          <Button
            onClick={() => router.push("/admin/mapa-mesas")}
            className="bg-primary hover:bg-primary/90"
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Mapa de Mesas
          </Button>
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
                  <p className="text-2xl font-bold text-red-500">{mesasOcupadas}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
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
                    ? "border-red-500/30 hover:border-red-500"
                    : "border-yellow-500/30 hover:border-yellow-500"
              }`}
              onClick={() => openMesaDialog(mesa)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl text-foreground">{mesa.numero}</CardTitle>
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

                  {mesa.status !== "disponivel" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLiberarMesa(mesa.id);
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

        {mesas.length === 0 && (
          <div className="text-center py-12">
            <Table2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma mesa encontrada</p>
          </div>
        )}
      </main>

      <MesaDialog open={dialogOpen} onOpenChange={setDialogOpen} mesa={selectedMesa} onSave={handleUpdateMesa} />
    </div>
  );
}
