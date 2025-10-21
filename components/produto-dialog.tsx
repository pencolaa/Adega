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
import { Textarea } from "@/components/ui/textarea"

interface Produto {
  id: number
  nome: string
  descricao: string
  categoria: string
  preco: number
  estoque: number
}

interface ProdutoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto: Produto | null
  onSave: (produto: any) => void
}

export function ProdutoDialog({ open, onOpenChange, produto, onSave }: ProdutoDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "Vinhos",
    preco: "",
    estoque: "",
  })

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        categoria: produto.categoria,
        preco: produto.preco.toString(),
        estoque: produto.estoque.toString(),
      })
    } else {
      setFormData({
        nome: "",
        descricao: "",
        categoria: "Vinhos",
        preco: "",
        estoque: "",
      })
    }
  }, [produto, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const produtoData = {
      ...(produto && { id: produto.id }),
      nome: formData.nome,
      descricao: formData.descricao,
      categoria: formData.categoria,
      preco: Number.parseFloat(formData.preco),
      estoque: Number.parseInt(formData.estoque),
    }
    onSave(produtoData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{produto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {produto ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className="text-foreground">
                Nome
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
              <Label htmlFor="descricao" className="text-foreground">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="bg-background border-border text-foreground"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria" className="text-foreground">
                Categoria
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Vinhos">Vinhos</SelectItem>
                  <SelectItem value="Cervejas">Cervejas</SelectItem>
                  <SelectItem value="Drinks">Drinks</SelectItem>
                  <SelectItem value="Petiscos">Petiscos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="preco" className="text-foreground">
                  Preço (R$)
                </Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estoque" className="text-foreground">
                  Estoque
                </Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
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
              {produto ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
