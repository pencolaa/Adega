"use client";

import { useState } from "react";
import Head from "next/head";
// 👇 CORREÇÃO AQUI
import { useRouter } from "next/navigation"; // Importado de 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Importando os componentes da sua pasta 'ui'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. Definir o schema de validação com Zod
const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos."),
  telefone: z.string().min(10, "Telefone inválido."),
  mesa: z.coerce.number().min(1, "Mesa deve ser maior que 0."),
});

export default function Checkin() {
  const router = useRouter(); // Agora esta linha vai funcionar
  // Estado para bloquear o botão após o envio
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Configurar o formulário com react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      telefone: "",
      mesa: undefined,
    },
  });

  // 3. Função de envio
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const agora = new Date();
    const horarioFormatado = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log("Dados do Cliente:", { ...values, horario: horarioFormatado });

    // 4. Usar 'sonner' (da sua lista) para notificação
    toast.success("Entrada Confirmada!", {
      description: `Cliente: ${values.nome} | Mesa: ${values.mesa} | Horário: ${horarioFormatado}`,
      duration: 3000,
    });

    // 5. Redirecionar após a notificação
    setTimeout(() => {
      // No App Router, o 'router.push' espera uma string
      router.push("/clients/cardapio"); 
    }, 3000); // 3 segundos de espera
  }

  return (
    <>
      <Head>
        <title>Check-in na Mesa - CAPONE</title>
      </Head>
      {/* Container principal com classes Tailwind (fundo escuro) */}
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">
              CAPONE
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Registro na Mesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 6. Construir o formulário com os componentes */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome completo"
                          {...field}
                          className="border-zinc-700 bg-zinc-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apenas números"
                            {...field}
                            className="border-zinc-700 bg-zinc-950"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(11) 9..."
                            {...field}
                            className="border-zinc-700 bg-zinc-950"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="mesa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº da Mesa</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 12"
                          {...field}
                          className="border-zinc-700 bg-zinc-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  disabled={isSubmitting} // Desabilita o botão
                >
                  {isSubmitting ? "Confirmando..." : "Confirmar Entrada"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}