import { NextResponse } from "next/server";

const API_URL = "http://localhost:4000/tables";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { id } = params;

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao atualizar mesa:", error);
    return NextResponse.json(
      { message: "Erro interno ao atualizar mesa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    return NextResponse.json({ message: "Mesa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar mesa:", error);
    return NextResponse.json(
      { message: "Erro interno ao deletar mesa" },
      { status: 500 }
    );
  }
}