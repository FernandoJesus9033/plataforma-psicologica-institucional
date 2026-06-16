import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // ✅ Eliminado include: { student: true }
    const evaluations = await prisma.evaluation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Error en GET /api/evaluations:", error);
    return NextResponse.json({ error: "Error al obtener evaluaciones" }, { status: 500 });
  }
}