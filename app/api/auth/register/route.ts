import { NextResponse } from "next/server";

const API_URL = "http://localhost:4001/auth/register";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { message: "Erro interno ao registrar usuário" },
      { status: 500 }
    );
  }
}
