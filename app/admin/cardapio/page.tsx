import { Navigation } from "@/components/navigation"
import { CardapioSection } from "@/components/cardapio-section"
import { Wine, Beer, Coffee, UtensilsCrossed } from "lucide-react"

// Mock data - será substituído por dados reais do banco
const menuData = {
  vinhos: [
    { id: 1, nome: "Vinho Tinto Reserva", descricao: "Cabernet Sauvignon, safra 2020", preco: 89.9, estoque: 15 },
    { id: 2, nome: "Vinho Branco Seco", descricao: "Chardonnay, safra 2021", preco: 75.0, estoque: 20 },
    { id: 3, nome: "Vinho Rosé", descricao: "Merlot Rosé, safra 2022", preco: 65.0, estoque: 12 },
    { id: 4, nome: "Espumante Brut", descricao: "Método tradicional", preco: 95.0, estoque: 8 },
  ],
  cervejas: [
    { id: 5, nome: "Cerveja Artesanal IPA", descricao: "American IPA, 500ml", preco: 18.0, estoque: 30 },
    { id: 6, nome: "Cerveja Pilsen", descricao: "Pilsen clássica, 350ml", preco: 12.0, estoque: 50 },
    { id: 7, nome: "Cerveja Stout", descricao: "Imperial Stout, 500ml", preco: 22.0, estoque: 15 },
  ],
  drinks: [
    { id: 8, nome: "Caipirinha", descricao: "Limão, cachaça artesanal", preco: 18.0, estoque: 100 },
    { id: 9, nome: "Gin Tônica", descricao: "Gin premium, tônica, limão siciliano", preco: 25.0, estoque: 100 },
    { id: 10, nome: "Negroni", descricao: "Gin, Campari, vermute", preco: 28.0, estoque: 100 },
  ],
  petiscos: [
    { id: 11, nome: "Tábua de Frios", descricao: "Queijos, salames, azeitonas", preco: 45.0, estoque: 20 },
    { id: 12, nome: "Bruschetta", descricao: "Tomate, manjericão, azeite", preco: 22.0, estoque: 30 },
    { id: 13, nome: "Porção de Azeitonas", descricao: "Mix de azeitonas temperadas", preco: 15.0, estoque: 40 },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance"></h1>
          
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Vinhos */}
        <CardapioSection title="Vinhos" icon={<Wine className="w-6 h-6" />} items={menuData.vinhos} />

        {/* Cervejas */}
        <CardapioSection title="Cervejas Artesanais" icon={<Beer className="w-6 h-6" />} items={menuData.cervejas} />

        {/* Drinks */}
        <CardapioSection title="Drinks" icon={<Coffee className="w-6 h-6" />} items={menuData.drinks} />

        {/* Petiscos */}
        <CardapioSection title="Petiscos" icon={<UtensilsCrossed className="w-6 h-6" />} items={menuData.petiscos} />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-muted-foreground">© 2025 Adega. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
