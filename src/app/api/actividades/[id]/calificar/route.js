import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user || user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const { calificacion, comentario } = await req.json();
    const actividad = await prisma.activity.update({
      where: { id: params.id },
      data: { calificacion, comentario, status: "CALIFICADA" }
    });
    return NextResponse.json(actividad);
  } catch (error) {
    return NextResponse.json({ error: "Error al calificar" }, { status: 500 });
  }
}