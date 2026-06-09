import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (user?.role !== "STUDENT") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { actividadId, nuevoNombre } = body;

    const actividad = await prisma.activity.findFirst({
      where: { id: actividadId }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    const actividadActualizada = await prisma.activity.update({
      where: { id: actividadId },
      data: {
        entregaNombre: nuevoNombre
      }
    });

    return NextResponse.json({ success: true, actividad: actividadActualizada });
  } catch (error) {
    console.error("Error al actualizar nombre:", error);
    return NextResponse.json({ error: "Error al actualizar nombre" }, { status: 500 });
  }
}