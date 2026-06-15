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
  if (userData) {
    const parsed = JSON.parse(userData);
    userRole = parsed.role;
  }

  const store = getStore("citas");
  const citas: any[] = [];

  for await (const item of store.list()) {
    const cita = await store.get(item.key);
    if (cita) {
      const parsed = JSON.parse(cita);
      if (userRole === "PSYCHOLOGIST") {
        citas.push(parsed);
      } else if (parsed.studentEmail === session.user.email) {
        citas.push(parsed);
      }
    }
  }

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
    return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
  }

  const cita = {
    id: crypto.randomUUID(),
    studentEmail: session.user.email,
    studentName: session.user.name || "Estudiante",
    fecha: date,
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