import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

// Helper para obtener el rol del usuario
async function getUserRole(email: string): Promise<string> {
  if (!email) return "STUDENT";
  const store = getStore("usuarios");
  const userData = await store.get(email);
  if (!userData) return "STUDENT";
  try {
    const user = JSON.parse(userData);
    return user.role || "STUDENT";
  } catch {
    return "STUDENT";
  }
}

// GET - Obtener citas (psicóloga ve todas, alumno solo las suyas)
export async function GET() {
  const session = await getServerSession();
  console.log("🔍 [GET /api/citas] Session email:", session?.user?.email);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const userRole = await getUserRole(userEmail);
  console.log("🔍 [GET /api/citas] Rol:", userRole);

  const store = getStore("citas");
  const todasLasCitas = [];

  // Recuperar TODAS las citas del store
  for await (const item of store.list()) {
    const citaRaw = await store.get(item.key);
    if (citaRaw) {
      try {
        const cita = JSON.parse(citaRaw);
        todasLasCitas.push(cita);
      } catch (e) {
        console.error("Error parsing cita:", e);
      }
    }
  }

  console.log("📊 [GET /api/citas] Total citas en store:", todasLasCitas.length);

  // Filtrar según el rol
  let resultado;
  if (userRole === "PSYCHOLOGIST") {
    // Psicóloga: devolver todas con el formato que espera AgendaPage
    resultado = todasLasCitas.map(c => ({
      id: c.id,
      fecha: c.fecha,
      hora: c.hora || "12:00",
      motivo: c.motivo || "Sin motivo",
      estado: c.estado || "PENDIENTE",
      studentName: c.studentName || "Estudiante",
      studentEmail: c.studentEmail
    }));
  } else {
    // Alumno: solo sus citas
    resultado = todasLasCitas
      .filter(c => c.studentEmail === userEmail)
      .map(c => ({
        id: c.id,
        fecha: c.fecha,
        hora: c.hora || "12:00",
        motivo: c.motivo || "Sin motivo",
        estado: c.estado || "PENDIENTE",
        studentName: c.studentName,
        studentEmail: c.studentEmail
      }));
  }

  // Ordenar por fecha más reciente
  resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  console.log("📤 [GET /api/citas] Enviando:", resultado.length, "citas");
  return NextResponse.json(resultado);
}

// POST - Crear nueva cita (solo alumnos)
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userRole = await getUserRole(session.user.email);
  if (userRole !== "STUDENT") {
    return NextResponse.json({ error: "Solo estudiantes pueden solicitar citas" }, { status: 403 });
  }

  // Obtener nombre del usuario
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  let userName = session.user.name || "Estudiante";
  if (userData) {
    const parsed = JSON.parse(userData);
    userName = parsed.name || parsed.nombre || "Estudiante";
  }

  const body = await req.json();
  const { date, motivo } = body;

  if (!date) {
    return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
  }

  const fechaObj = new Date(date);
  const fechaStr = fechaObj.toISOString().split('T')[0];
  const horaStr = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const nuevaCita = {
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
  await store.setJSON(nuevaCita.id, nuevaCita);
  console.log("✅ Cita creada:", nuevaCita.id);

  return NextResponse.json(nuevaCita, { status: 201 });
}

// PATCH - Actualizar estado de una cita (solo psicólogo)
export async function PATCH(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userRole = await getUserRole(session.user.email);
  if (userRole !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado - Solo psicólogos pueden confirmar citas" }, { status: 403 });
  }

  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "ID y status son requeridos" }, { status: 400 });
  }

  const store = getStore("citas");
  const citaRaw = await store.get(id);
  if (!citaRaw) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  const cita = JSON.parse(citaRaw);
  cita.estado = status;
  await store.setJSON(id, cita);

  console.log(`✅ Cita ${id} actualizada a estado: ${status}`);
  return NextResponse.json({ success: true, estado: status });
}

// DELETE - Cancelar/eliminar cita
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

  const userRole = await getUserRole(session.user.email);
  const store = getStore("citas");
  const citaRaw = await store.get(id);

  if (!citaRaw) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  const cita = JSON.parse(citaRaw);
  
  // Solo el dueño o la psicóloga pueden eliminar
  if (userRole !== "PSYCHOLOGIST" && cita.studentEmail !== session.user.email) {
    return NextResponse.json({ error: "No autorizado para eliminar esta cita" }, { status: 403 });
  }

  await store.delete(id);
  console.log(`✅ Cita ${id} eliminada`);
  return NextResponse.json({ success: true });
}