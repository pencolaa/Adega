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

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  cpf: string
  dataCadastro: string
  totalCompras: number
}

interface ClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: Cliente | null
  onSave: (cliente: any) => void
}

export function ClienteDialog({ open, onOpenChange, cliente, onSave }: ClienteDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataCadastro: new Date().toISOString().split("T")[0],
    totalCompras: "0",
  })

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
        dataCadastro: cliente.dataCadastro,
        totalCompras: cliente.totalCompras.toString(),
      })
    } else {
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dataCadastro: new Date().toISOString().split("T")[0],
        totalCompras: "0",
      })
    }
  }, [cliente, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clienteData = {
      ...(cliente && { id: cliente.id }),
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      cpf: formData.cpf,
      dataCadastro: formData.dataCadastro,
      totalCompras: Number.parseFloat(formData.totalCompras),
    }
    onSave(clienteData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {cliente ? "Atualize as informações do cliente" : "Adicione um novo cliente ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className="text-foreground">
                Nome Completo
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-background border-border text-foreground"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-border text-foreground"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="telefone" className="text-foreground">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="bg-background border-border text-foreground"
                  placeholder="(11) 98765-4321"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf" className="text-foreground">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="bg-background border-border text-foreground"
                  placeholder="123.456.789-00"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataCadastro" className="text-foreground">
                  Data de Cadastro
                </Label>
                <Input
                  id="dataCadastro"
                  type="date"
                  value={formData.dataCadastro}
                  onChange={(e) => setFormData({ ...formData, dataCadastro: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalCompras" className="text-foreground">
                  Total em Compras (R$)
                </Label>
                <Input
                  id="totalCompras"
                  type="number"
                  step="0.01"
                  value={formData.totalCompras}
                  onChange={(e) => setFormData({ ...formData, totalCompras: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {cliente ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
