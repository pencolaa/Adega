"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wine, LayoutDashboard, Package, Users, Table2, UserCog, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Wine className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Adega</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Cardápio
              </Link>
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

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
