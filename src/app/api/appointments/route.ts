import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    // ✅ Eliminado include: { student: true }
    const appointments = await prisma.appointment.findMany({
      where: studentId ? { studentId } : {},
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error en GET /api/appointments:", error);
    return NextResponse.json({ error: "Error al obtener citas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, date, motivo } = body;

    // ✅ Eliminado include: { student: true }
    const appointment = await prisma.appointment.create({
      data: {
        studentId,
        date: new Date(date),
        motivo: motivo || null,
        status: "PENDING"
      }
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/appointments:", error);
    return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
  }
}