import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";

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
    const { actividadId } = body;

    const actividad = await prisma.activity.findFirst({
      where: { id: actividadId }
    });

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    // Eliminar archivo físico si existe
    if (actividad.entregaUrl) {
      const filePath = path.join(process.cwd(), "public", actividad.entregaUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log("Archivo no encontrado o ya eliminado");
      }
    }

    // Limpiar campos de entrega
    const actividadActualizada = await prisma.activity.update({
      where: { id: actividadId },
      data: {
        entregaUrl: null,
        entregaNombre: null,
        entregaTipo: null,
        entregadoEn: null,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, actividad: actividadActualizada });
  } catch (error) {
    console.error("Error al eliminar entrega:", error);
    return NextResponse.json({ error: "Error al eliminar la entrega" }, { status: 500 });
  }
}