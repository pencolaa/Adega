"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | undefined>(undefined)

  useEffect(() => {
    const savedTheme = (localStorage.getItem("adega-theme") as Theme) || "dark"
    setTheme(savedTheme)
    document.documentElement.classList.add(savedTheme)
  }, [])

  useEffect(() => {
    if (theme) {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      localStorage.setItem("adega-theme", theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const currentTheme = theme || "dark"

  return <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
