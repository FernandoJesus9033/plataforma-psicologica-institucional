import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

// Helper para obtener el rol del usuario
async function getUserRole(email: string): Promise<string> {
  if (!email) return "STUDENT";
  try {
    const store = getStore("usuarios");
    const userData = await store.get(email);
    if (!userData) return "STUDENT";
    const user = JSON.parse(userData);
    return user.role || "STUDENT";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "STUDENT";
  }
}

// GET - Obtener citas
export async function GET() {
  try {
    console.log("🚀 [GET /api/citas] Iniciando...");
    
    const session = await getServerSession();
    console.log("📧 Session email:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userRole = await getUserRole(userEmail);
    console.log("👤 Rol:", userRole);

    // Intentar obtener el store de citas
    let store;
    try {
      store = getStore("citas");
      console.log("✅ Store 'citas' conectado");
    } catch (err) {
      console.error("❌ Error al conectar store 'citas':", err);
      return NextResponse.json([], { status: 200 });
    }

    const todasLasCitas = [];

    // Recorrer las citas
    try {
      for await (const item of store.list()) {
        try {
          const citaRaw = await store.get(item.key);
          if (citaRaw) {
            const cita = JSON.parse(citaRaw);
            todasLasCitas.push(cita);
          }
        } catch (err) {
          console.error("Error procesando item:", item.key, err);
        }
      }
    } catch (err) {
      console.error("Error al listar citas:", err);
    }

    console.log("📊 Total citas en store:", todasLasCitas.length);

    // Filtrar según el rol
    let resultado;
    if (userRole === "PSYCHOLOGIST") {
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

    resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    console.log("📤 Enviando:", resultado.length, "citas");
    return NextResponse.json(resultado);
    
  } catch (error) {
    console.error("❌ Error FATAL en GET /api/citas:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Crear nueva cita
export async function POST(req: Request) {
  try {
    console.log("🚀 [POST /api/citas] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.email);
    if (userRole !== "STUDENT") {
      return NextResponse.json({ error: "Solo estudiantes pueden solicitar citas" }, { status: 403 });
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
      studentName: session.user.name || "Estudiante",
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
    
  } catch (error) {
    console.error("❌ Error en POST /api/citas:", error);
    return NextResponse.json({ error: "Error al crear la cita" }, { status: 500 });
  }
}

// PATCH - Actualizar estado de una cita
export async function PATCH(req: Request) {
  try {
    console.log("🚀 [PATCH /api/citas] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.email);
    if (userRole !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID y status requeridos" }, { status: 400 });
    }

    const store = getStore("citas");
    const citaRaw = await store.get(id);
    if (!citaRaw) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    const cita = JSON.parse(citaRaw);
    cita.estado = status;
    await store.setJSON(id, cita);

    console.log("✅ Cita actualizada:", id, status);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error en PATCH /api/citas:", error);
    return NextResponse.json({ error: "Error al actualizar la cita" }, { status: 500 });
  }
}

// DELETE - Eliminar cita
export async function DELETE(req: Request) {
  try {
    console.log("🚀 [DELETE /api/citas] Iniciando...");
    
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
    
    if (userRole !== "PSYCHOLOGIST" && cita.studentEmail !== session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await store.delete(id);
    console.log("✅ Cita eliminada:", id);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error en DELETE /api/citas:", error);
    return NextResponse.json({ error: "Error al eliminar la cita" }, { status: 500 });
  }
}