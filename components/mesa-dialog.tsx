"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Mesa {
  id: number
  numero: number
  capacidade: number
  status: "disponivel" | "ocupada" | "reservada"
  clientes?: number
  horarioOcupacao?: string
  nomeReserva?: string
}

interface MesaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mesa: Mesa | null
  onSave: (mesa: Mesa) => void
}

export function MesaDialog({ open, onOpenChange, mesa, onSave }: MesaDialogProps) {
  const [formData, setFormData] = useState({
    status: "disponivel" as "disponivel" | "ocupada" | "reservada",
    clientes: "",
    horarioOcupacao: "",
    nomeReserva: "",
  })

  useEffect(() => {
    if (mesa) {
      setFormData({
        status: mesa.status,
        clientes: mesa.clientes?.toString() || "",
        horarioOcupacao: mesa.horarioOcupacao || "",
        nomeReserva: mesa.nomeReserva || "",
      })
    }
  }, [mesa, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mesa) return

    const mesaAtualizada: Mesa = {
      ...mesa,
      status: formData.status,
      clientes: formData.status === "ocupada" ? Number.parseInt(formData.clientes) : undefined,
      horarioOcupacao: formData.status === "ocupada" ? formData.horarioOcupacao : undefined,
      nomeReserva: formData.status === "reservada" ? formData.nomeReserva : undefined,
    }

    onSave(mesaAtualizada)
  }

  if (!mesa) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Mesa {mesa.numero}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Capacidade: {mesa.capacidade} pessoas</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "disponivel" | "ocupada" | "reservada") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                  <SelectItem value="reservada">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "ocupada" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="clientes" className="text-foreground">
                    Número de Clientes
                  </Label>
                  <Input
                    id="clientes"
                    type="number"
                    min="1"
                    max={mesa.capacidade}
                    value={formData.clientes}
                    onChange={(e) => setFormData({ ...formData, clientes: e.target.value })}
                    className="bg-background border-border text-foreground"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="horario" className="text-foreground">
                    Horário de Ocupação
                  </Label>
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horarioOcupacao}
                    onChange={(e) => setFormData({ ...formData, horarioOcupacao: e.target.value })}
                    className="bg-background border-border text-foreground"
                    required
                  />
                </div>
              </>
            )}

            {formData.status === "reservada" && (
              <div className="grid gap-2">
                <Label htmlFor="nomeReserva" className="text-foreground">
                  Nome da Reserva
                </Label>
                <Input
                  id="nomeReserva"
                  value={formData.nomeReserva}
                  onChange={(e) => setFormData({ ...formData, nomeReserva: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
