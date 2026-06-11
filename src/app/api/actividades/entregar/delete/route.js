import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function DELETE(req) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await prisma.activity.update({
      where: { id },
      data: { entregaUrl: null, entregaNombre: null, entregadoEn: null, status: "PENDING" }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar entrega" }, { status: 500 });
  }
}