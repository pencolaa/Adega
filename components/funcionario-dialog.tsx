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

interface FuncionarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funcionario: Funcionario | null
  onSave: (funcionario: any) => void
}

export function FuncionarioDialog({ open, onOpenChange, funcionario, onSave }: FuncionarioDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "Garçom",
    dataAdmissao: new Date().toISOString().split("T")[0],
    salario: "",
    status: "ativo" as "ativo" | "inativo",
  })

  useEffect(() => {
    if (funcionario) {
      setFormData({
        nome: funcionario.nome,
        email: funcionario.email,
        telefone: funcionario.telefone,
        cargo: funcionario.cargo,
        dataAdmissao: funcionario.dataAdmissao,
        salario: funcionario.salario.toString(),
        status: funcionario.status,
      })
    } else {
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cargo: "Garçom",
        dataAdmissao: new Date().toISOString().split("T")[0],
        salario: "",
        status: "ativo",
      })
    }
  }, [funcionario, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const funcionarioData = {
      ...(funcionario && { id: funcionario.id }),
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      cargo: formData.cargo,
      dataAdmissao: formData.dataAdmissao,
      salario: Number.parseFloat(formData.salario),
      status: formData.status,
    }
    onSave(funcionarioData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {funcionario ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {funcionario ? "Atualize as informações do funcionário" : "Adicione um novo funcionário à equipe"}
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
                  placeholder="(11) 91234-5678"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cargo" className="text-foreground">
                  Cargo
                </Label>
                <Select value={formData.cargo} onValueChange={(value) => setFormData({ ...formData, cargo: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Sommelier">Sommelier</SelectItem>
                    <SelectItem value="Garçom">Garçom</SelectItem>
                    <SelectItem value="Cozinheira">Cozinheira</SelectItem>
                    <SelectItem value="Bartender">Bartender</SelectItem>
                    <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataAdmissao" className="text-foreground">
                  Data de Admissão
                </Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={formData.dataAdmissao}
                  onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salario" className="text-foreground">
                  Salário (R$)
                </Label>
                <Input
                  id="salario"
                  type="number"
                  step="0.01"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "ativo" | "inativo") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {funcionario ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
