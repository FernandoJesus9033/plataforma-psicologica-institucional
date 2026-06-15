import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

// GET - Obtener un alumno específico
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Buscando alumno con ID:", id);
    
    const usuariosStore = getStore("usuarios");
    
    // Buscar alumno por id o email
    let alumnoEncontrado = null;
    for await (const item of usuariosStore.list()) {
      const raw = await usuariosStore.get(item.key);
      if (raw) {
        try {
          const user = JSON.parse(raw);
          if (user.id === id || user.email === id) {
            alumnoEncontrado = {
              id: user.id,
              name: user.name || user.nombre || "Sin nombre",
              email: user.email,
              matricula: user.matricula || "",
              createdAt: user.createdAt || new Date().toISOString()
            };
            break;
          }
        } catch (e) {
          console.error("Error parsing:", e);
        }
      }
    }
    
    if (!alumnoEncontrado) {
      console.log("❌ Alumno no encontrado:", id);
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }
    
    console.log("✅ Alumno encontrado:", alumnoEncontrado.name);
    return NextResponse.json(alumnoEncontrado);
    
  } catch (error) {
    console.error("❌ Error en GET /api/alumnos/[id]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT - Actualizar alumno
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, email, matricula } = body;
    
    console.log("✏️ Actualizando alumno:", id, { name, email, matricula });
    
    const usuariosStore = getStore("usuarios");
    
    // Buscar el alumno actual
    let emailOriginal = null;
    let alumnoData = null;
    for await (const item of usuariosStore.list()) {
      const raw = await usuariosStore.get(item.key);
      if (raw) {
        try {
          const user = JSON.parse(raw);
          if (user.id === id) {
            emailOriginal = item.key;
            alumnoData = user;
            break;
          }
        } catch (e) {
          console.error("Error parsing:", e);
        }
      }
    }
    
    if (!alumnoData) {
      console.log("❌ Alumno no encontrado para actualizar:", id);
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }
    
    // Actualizar datos
    alumnoData.name = name;
    alumnoData.nombre = name;
    if (matricula !== undefined) alumnoData.matricula = matricula;
    
    // Si cambió el email, eliminar el viejo y crear nuevo
    if (email !== emailOriginal) {
      console.log("📧 Email cambiado de", emailOriginal, "a", email);
      await usuariosStore.delete(emailOriginal);
      alumnoData.email = email;
      await usuariosStore.setJSON(email, alumnoData);
    } else {
      await usuariosStore.setJSON(emailOriginal, alumnoData);
    }
    
    console.log("✅ Alumno actualizado:", alumnoData.name);
    return NextResponse.json({ 
      success: true, 
      id: alumnoData.id,
      name: alumnoData.name,
      email: alumnoData.email,
      matricula: alumnoData.matricula
    });
    
  } catch (error) {
    console.error("❌ Error en PUT /api/alumnos/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar alumno" }, { status: 500 });
  }
}

// DELETE - Eliminar alumno
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🗑️ Eliminando alumno con ID:", id);
    
    const usuariosStore = getStore("usuarios");
    
    // Buscar el alumno para obtener su email
    let emailEliminar = null;
    let alumnoName = null;
    for await (const item of usuariosStore.list()) {
      const raw = await usuariosStore.get(item.key);
      if (raw) {
        try {
          const user = JSON.parse(raw);
          if (user.id === id) {
            emailEliminar = item.key;
            alumnoName = user.name;
            break;
          }
        } catch (e) {
          console.error("Error parsing:", e);
        }
      }
    }
    
    if (!emailEliminar) {
      console.log("❌ Alumno no encontrado para eliminar:", id);
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }
    
    await usuariosStore.delete(emailEliminar);
    console.log("✅ Alumno eliminado:", alumnoName, "(", emailEliminar, ")");
    
    return NextResponse.json({ success: true, message: "Alumno eliminado correctamente" });
    
  } catch (error) {
    console.error("❌ Error en DELETE /api/alumnos/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 });
  }
}