"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MesaFormatada {
  id: string
  numero: string
  capacidade: number
  status: "disponivel" | "ocupada" | "reservada"
}

interface MesaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mesa: MesaFormatada | null
  onSave: (mesa: MesaFormatada) => void
}

export function MesaDialog({ open, onOpenChange, mesa, onSave }: MesaDialogProps) {
  const [status, setStatus] = useState<"disponivel" | "ocupada" | "reservada">(
    "disponivel"
  )

  useEffect(() => {
    if (mesa) {
      setStatus(mesa.status)
    }
  }, [mesa])

  const handleSave = () => {
    if (!mesa) return

    onSave({
      ...mesa,
      status,
    })
  }

  if (!mesa) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Mesa - {mesa.numero}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade</Label>
            <div className="text-sm text-muted-foreground">
              {mesa.capacidade} lugares
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "disponivel" | "ocupada" | "reservada")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupada">Ocupada</SelectItem>
                <SelectItem value="reservada">Reservada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
