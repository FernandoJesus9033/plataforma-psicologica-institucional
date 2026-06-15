import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export interface Cita {
  id: string;
  studentEmail: string;
  studentName: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";
  createdAt: string;
}

export async function GET() {
  const session = await getServerSession();
  console.log("🔍 GET /api/citas - Session:", session?.user?.email, "Role:", session?.user?.role);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("citas");
  const citas: Cita[] = [];

  // Si es psicóloga, ver todas las citas
  if (session.user.role === "PSYCHOLOGIST") {
    for await (const item of store.list()) {
      const cita = await store.get(item.key);
      if (cita) {
        citas.push(JSON.parse(cita));
      }
    }
    console.log(`📋 Psicóloga: ${citas.length} citas encontradas`);
    return NextResponse.json(citas);
  }

  // Si es estudiante, solo sus citas
  for await (const item of store.list()) {
    const cita = await store.get(item.key);
    if (cita) {
      const parsed = JSON.parse(cita);
      if (parsed.studentEmail === session.user.email) {
        citas.push(parsed);
      }
    }
  }
  console.log(`📋 Estudiante ${session.user.email}: ${citas.length} citas encontradas`);

  return NextResponse.json(citas);
}

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

  const store = getStore("citas");
  await store.setJSON(cita.id, cita);
  console.log(`✅ Cita creada para ${session.user.email}: ${cita.id}`);
  
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
    return NextResponse.json({ error: "ID de cita requerido" }, { status: 400 });
  }

  const store = getStore("citas");
  const cita = await store.get(id);
  
  if (!cita) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  const parsed = JSON.parse(cita);
  parsed.estado = "CANCELADA";
  await store.setJSON(id, parsed);
  console.log(`❌ Cita cancelada: ${id}`);

  return NextResponse.json({ success: true });
}