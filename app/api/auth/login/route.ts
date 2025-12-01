// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

const API_URL = "http://localhost:4000/auth/login";

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
    console.error("Erro no login:", error);
    return NextResponse.json(
      { message: "Erro interno ao fazer login" },
      { status: 500 }
    );
  }
}
