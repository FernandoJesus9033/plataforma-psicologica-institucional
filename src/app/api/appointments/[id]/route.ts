import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.appointment.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Cita eliminada" });
  } catch (error) {
    console.error("Error en DELETE /api/appointments/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar cita" }, { status: 500 });
  }
}