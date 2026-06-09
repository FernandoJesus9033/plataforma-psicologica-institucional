import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { notes } = await req.json();

    const student = await prisma.student.update({
      where: { id },
      data: { notes }
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error en PUT /api/alumnos/[id]/notes:", error);
    return NextResponse.json(
      { error: "Error al guardar notas" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      select: { notes: true, name: true, email: true }
    });

    return NextResponse.json({ notes: student?.notes || "" });
  } catch (error) {
    console.error("Error en GET /api/alumnos/[id]/notes:", error);
    return NextResponse.json(
      { error: "Error al obtener notas" },
      { status: 500 }
    );
  }
}