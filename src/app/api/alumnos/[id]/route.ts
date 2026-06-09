import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET - Obtener un alumno por ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        evaluations: true,
        appointments: true,
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    return NextResponse.json({ error: "Error al obtener alumno" }, { status: 500 });
  }
}

// PUT - Actualizar un alumno
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email }
    });

    if (user?.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, email } = body;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { name, email }
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    return NextResponse.json({ error: "Error al actualizar el alumno" }, { status: 500 });
  }
}

// POST - Alternativa para formularios HTML (redirige a PUT)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  try {
    const { id } = await params;
    
    await prisma.student.update({
      where: { id },
      data: { name, email }
    });

    return NextResponse.redirect(new URL("/alumnos", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL(`/alumnos/${params}/editar?error=1`, req.url));
  }
}

// DELETE - Eliminar un alumno
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.evaluation.deleteMany({ where: { studentId: id } });
    await prisma.appointment.deleteMany({ where: { studentId: id } });
    await prisma.testResponse.deleteMany({ where: { studentId: id } });
    await prisma.testResult.deleteMany({ where: { studentId: id } });
    await prisma.student.delete({ where: { id } });

    return NextResponse.json({ message: "Alumno eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 });
  }
}