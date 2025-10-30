"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react" // NOVO: Adicionado
import { LayoutDashboard, Package, Users, Table2, UserCog, Moon, Sun, ShoppingCart } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils" // NOVO: Importando 'cn' para classes dinâmicas (se você não usa, pode remover)

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false) // NOVO: Estado para o menu

  const isActive = (path: string) => pathname === path

  // NOVO: Lista de links para o menu mobile
  const navLinks = [
    { href: "/", label: "Cardápio", icon: LayoutDashboard }, // (Ícone de exemplo, troque se quiser)
    { href: "/admin/fazer-pedido", label: "Fazer Pedido", icon: ShoppingCart },
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Produtos", icon: Package },
    { href: "/admin/mesas", label: "Mesas", icon: Table2 },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/funcionarios", label: "Funcionários", icon: UserCog },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo + Nome */}
              <Image
                src="/caponelogo.jpg"
                alt="Logo Capone"
                width={35}
                height={35}
                className="rounded-md object-cover"
                priority
              />
              <span className="text-xl font-bold text-foreground">Capone</span>

              <div className="hidden md:flex items-center gap-1">
                {/* ... Seus links de desktop ... */}
                <Link
                  href="/admin/cardapio"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/cardapio")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  Cardápio
                </Link>

                <Link
                  href="/admin/fazer-pedido"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    isActive("/fazer-pedido")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Fazer Pedido
                </Link>
                {/* ... (restante dos seus links) ... */}
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 inline mr-1" />
                  Dashboard
                </Link>

                <Link
                  href="/admin/produtos"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/produtos")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Package className="w-4 h-4 inline mr-1" />
                  Produtos
                </Link>

                <Link
                  href="/admin/mesas"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/mesas")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Table2 className="w-4 h-4 inline mr-1" />
                  Mesas
                </Link>

                <Link
                  href="/admin/clientes"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/clientes")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Clientes
                </Link>

                <Link
                  href="/admin/funcionarios"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/funcionarios")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <UserCog className="w-4 h-4 inline mr-1" />
                  Funcionários
                </Link>
              </div>
            </div>

            {/* NOVO: Wrapper para os botões da direita */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="sr-only">Alternar tema</span>
              </Button>

              {/* NOVO: Botão animado (Menu Mobile) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={cn(
                  "relative transition-transform duration-500 z-50 md:hidden",
                  menuOpen ? "rotate-180" : "rotate-0"
                )}
              >
                <Image
                  src={menuOpen ? "/iconeVermelho.png" : "/iconeBranco.png"}
                  alt="Menu"
                  width={36} // Tamanho do ícone
                  height={36}
                  className="transition-all duration-500"
                />
              </button>
            </div>
          </div>
        </div>

        {/* NOVO: Dropdown do Menu Mobile */}
        {menuOpen && (
          <div className="absolute top-0 left-0 w-full bg-card shadow-lg z-40 transition-all duration-500 animate-slide-in md:hidden">
            <div className="pt-20 pb-4 px-4 space-y-2">
              {/* pt-20 para pular o header */}
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-secondary",
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* NOVO: CSS da Animação */}
      <style jsx global>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}