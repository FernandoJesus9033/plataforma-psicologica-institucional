import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Obtener todos los alumnos (de la tabla Student)
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener alumnos" }, { status: 500 });
  }
}

// Crear nuevo alumno
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, email } = await req.json();

    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: { name, email }
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear alumno" }, { status: 500 });
  }
}