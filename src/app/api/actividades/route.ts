import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const store = getStore("actividades");
  const actividades: any[] = [];

  for await (const item of store.list()) {
    const actividad = await store.get(item.key);
    if (actividad) {
      actividades.push(JSON.parse(actividad));
    }
  }

  return NextResponse.json(actividades);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener rol del usuario desde el store
  const usuariosStore = getStore("usuarios");
  const userData = await usuariosStore.get(session.user.email);
  
  if (!userData) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  
  const currentUser = JSON.parse(userData);
  if (currentUser.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, studentId, dueDate, fileUrl, fileName, fileType } = body;

    if (!title || !studentId) {
      return NextResponse.json({ error: "Título y estudiante son requeridos" }, { status: 400 });
    }

    // Obtener nombre del estudiante
    let studentName = "Estudiante";
    for await (const item of usuariosStore.list()) {
      const usuario = await usuariosStore.get(item.key);
      if (usuario) {
        const parsed = JSON.parse(usuario);
        if (parsed.id === studentId || parsed.email === studentId) {
          studentName = parsed.name;
          break;
        }
      }
    }

    const actividad = {
      id: crypto.randomUUID(),
      title,
      description: description || "",
      studentId,
      studentName,
      psychologistId: currentUser.id,
      psychologistName: currentUser.name,
      dueDate: dueDate || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    const store = getStore("actividades");
    await store.setJSON(actividad.id, actividad);

    return NextResponse.json(actividad, { status: 201 });
  } catch (error) {
    console.error("Error al crear actividad:", error);
    return NextResponse.json({ error: "Error al crear actividad" }, { status: 500 });
  }
}