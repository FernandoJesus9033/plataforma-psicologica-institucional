import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      include: { student: true },
      orderBy: { date: "asc" }
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
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { studentId, date } = await req.json();

    const appointment = await prisma.appointment.create({
      data: {
        studentId,
        date: new Date(date)
      },
      include: { student: true }
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/appointments:", error);
    return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
  }
}