import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: number
  nome: string
  descricao: string
  preco: number
  estoque: number
}

interface CardapioSectionProps {
  title: string
  icon: React.ReactNode
  items: MenuItem[]
}

export function CardapioSection({ title, icon, items }: CardapioSectionProps) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-primary">{icon}</div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="bg-card border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-foreground">{item.nome}</CardTitle>
                {item.estoque < 10 && (
                  <Badge variant="destructive" className="text-xs">
                    Últimas unidades
                  </Badge>
                )}
              </div>
              <CardDescription className="text-muted-foreground">{item.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">R$ {item.preco.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">Estoque: {item.estoque}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
