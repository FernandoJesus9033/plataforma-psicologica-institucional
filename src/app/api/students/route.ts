import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener estudiantes de la tabla Student (no de User)
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    console.log("Estudiantes encontrados:", students);
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error en /api/students:", error);
    return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 });
  }
}