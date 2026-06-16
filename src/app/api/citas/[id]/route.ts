import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que sea psicóloga usando Prisma
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden modificar citas" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { estado } = body;

    // Verificar que la cita existe
    const citaExistente = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!citaExistente) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    // Actualizar el estado de la cita
    const citaActualizada = await prisma.appointment.update({
      where: { id },
      data: {
        status: estado || "CONFIRMADA"
      }
    });

    console.log("✅ Cita actualizada:", citaActualizada.id, "Nuevo estado:", citaActualizada.status);

    return NextResponse.json({ 
      success: true, 
      cita: {
        id: citaActualizada.id,
        fecha: citaActualizada.date.toISOString().split('T')[0],
        hora: citaActualizada.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        motivo: citaActualizada.motivo,
        estado: citaActualizada.status
      }
    });

  } catch (error) {
    console.error("❌ Error en PUT /api/citas/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar la cita" }, { status: 500 });
  }
}