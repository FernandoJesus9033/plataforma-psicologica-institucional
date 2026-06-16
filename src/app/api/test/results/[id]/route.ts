import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    // ✅ Eliminado include: { student: true }
    const result = await prisma.testResult.findUnique({
      where: { studentId: id }
    });

    if (!result) {
      return NextResponse.json({ error: "Resultado no encontrado" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en GET /api/test/results/[id]:", error);
    return NextResponse.json({ error: "Error al obtener resultado" }, { status: 500 });
  }
}