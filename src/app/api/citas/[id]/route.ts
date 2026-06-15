import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verificar que sea psicóloga
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  if (!userData) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  
  const user = JSON.parse(userData);
  if (user.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { estado } = body;

  const store = getStore("citas");
  const citaRaw = await store.get(id);
  
  if (!citaRaw) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  const cita = JSON.parse(citaRaw);
  cita.estado = estado || "CONFIRMADA";
  await store.setJSON(id, cita);

  return NextResponse.json({ success: true, cita });
}