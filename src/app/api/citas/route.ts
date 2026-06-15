import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener rol del usuario desde el store
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  let userRole = "STUDENT";
  let userName = session.user.name || "Usuario";
  
  if (userData) {
    const parsed = JSON.parse(userData);
    userRole = parsed.role;
    userName = parsed.name;
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

  // Filtrar según rol
  let resultado = citas;
  if (userRole !== "PSYCHOLOGIST") {
    resultado = citas.filter(c => c.studentEmail === session.user.email);
  }

  // Formatear para el frontend
  const citasFormateadas = resultado.map(c => ({
    id: c.id,
    fecha: c.fecha,
    hora: c.hora || "12:00",
    motivo: c.motivo || "Sin motivo",
    estado: c.estado || "PENDIENTE",
    studentName: c.studentName,
    studentEmail: c.studentEmail
  }));

  // Ordenar por fecha más reciente
  citasFormateadas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return NextResponse.json(citasFormateadas);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener nombre del usuario
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  let userName = session.user.name || "Estudiante";
  if (userData) {
    const parsed = JSON.parse(userData);
    userName = parsed.name;
  }

  const body = await req.json();
  const { date, motivo } = body;

  if (!date) {
    return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
  }

  const fechaObj = new Date(date);
  const fechaStr = fechaObj.toISOString().split('T')[0];
  const horaStr = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const cita = {
    id: crypto.randomUUID(),
    studentEmail: session.user.email,
    studentName: userName,
    fecha: fechaStr,
    hora: horaStr,
    motivo: motivo || "Sin motivo",
    estado: "PENDIENTE",
    createdAt: new Date().toISOString()
  };

  const store = getStore("citas");
  await store.setJSON(cita.id, cita);

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

  return NextResponse.json({ success: true });
}