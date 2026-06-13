import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { obtenerCitasPorEstudiante, guardarCita, cancelarCita, type Cita } from "@/lib/blobs";

// GET: Obtener citas del estudiante actual
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const citas = await obtenerCitasPorEstudiante(session.user.email);
  return NextResponse.json(citas);
}

// POST: Crear una nueva cita
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { date, motivo } = body;

  if (!date) {
    return NextResponse.json({ error: "Fecha y hora son requeridas" }, { status: 400 });
  }

  const cita: Cita = {
    id: crypto.randomUUID(),
    studentEmail: session.user.email,
    studentName: session.user.name || "Estudiante",
    fecha: new Date(date).toISOString().split('T')[0],
    hora: new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    motivo: motivo || "Sin motivo especificado",
    estado: "PENDIENTE",
    createdAt: new Date().toISOString(),
  };

  await guardarCita(cita);
  return NextResponse.json(cita, { status: 201 });
}

// DELETE: Cancelar una cita
export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de cita requerido" }, { status: 400 });
  }

  const cita = await cancelarCita(id);
  if (!cita) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}