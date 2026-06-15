import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  console.log("🔍 GET /api/citas - Usuario:", session?.user?.email);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("citas");
  const citas = [];

  for await (const item of store.list()) {
    const citaRaw = await store.get(item.key);
    if (citaRaw) {
      const cita = JSON.parse(citaRaw);
      citas.push(cita);
    }
  }

  // Si es psicóloga, devolver todas; si es alumno, filtrar por email
  const userRole = session.user.role;
  let resultado = citas;
  if (userRole !== "PSYCHOLOGIST") {
    resultado = citas.filter(c => c.studentEmail === session.user.email);
  }

  // Formatear para el frontend (agregar hora si no existe)
  const citasFormateadas = resultado.map(c => ({
    id: c.id,
    fecha: c.fecha,
    hora: c.hora || "12:00", // valor por defecto si no hay hora
    motivo: c.motivo || "Sin motivo",
    estado: c.estado || "PENDIENTE"
  }));

  console.log(`📋 Citas devueltas: ${citasFormateadas.length}`);
  return NextResponse.json(citasFormateadas);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  console.log("📝 POST /api/citas - Usuario:", session?.user?.email);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { date, motivo } = body;

  if (!date) {
    return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
  }

  // Extraer fecha y hora del ISO string
  const fechaObj = new Date(date);
  const fechaStr = fechaObj.toISOString().split('T')[0];
  const horaStr = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const cita = {
    id: crypto.randomUUID(),
    studentEmail: session.user.email,
    studentName: session.user.name || "Estudiante",
    fecha: fechaStr,
    hora: horaStr,
    motivo: motivo || "Sin motivo",
    estado: "PENDIENTE",
    createdAt: new Date().toISOString()
  };

  const store = getStore("citas");
  await store.setJSON(cita.id, cita);
  console.log("✅ Cita guardada:", cita.id);

  return NextResponse.json(cita, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const store = getStore("citas");
  await store.delete(id);
  console.log("❌ Cita eliminada:", id);

  return NextResponse.json({ success: true });
}