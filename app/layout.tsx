import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ComandaProvider } from "@/context/comanda-context";

// 👇 1. IMPORTANDO O SEU THEME PROVIDER CUSTOMIZADO
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAPONE Adega",
  description: "Gestão e cardápio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // O seu provider customizado já mexe no <html>,
    // então podemos manter o 'suppressHydrationWarning' por segurança
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {/* 👇 2. CORREÇÃO: Chame o ThemeProvider SEM PROPS */}
        <ThemeProvider>
          <ComandaProvider>
            {children}
            <Toaster richColors theme="dark" />
          </ComandaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}