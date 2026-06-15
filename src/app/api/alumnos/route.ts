import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  try {
    console.log("🚀 GET /api/alumnos - Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("📧 Usuario autenticado:", session.user.email);

    const usuariosStore = getStore("usuarios");
    
    // Verificar que el usuario actual es psicólogo
    const currentUserRaw = await usuariosStore.get(session.user.email);
    if (!currentUserRaw) {
      console.log("❌ Usuario no encontrado en store");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(currentUserRaw);
    console.log("👤 Usuario actual:", currentUser.email, "Rol:", currentUser.role);
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      console.log("❌ Usuario no es psicólogo");
      return NextResponse.json({ error: "No autorizado - Se requiere rol PSYCHOLOGIST" }, { status: 403 });
    }

    // Obtener todos los usuarios del store
    const students: any[] = [];

    for await (const item of usuariosStore.list()) {
      // Saltar al psicólogo actual
      if (item.key === session.user.email) {
        console.log(`⏭️ Saltando psicólogo: ${item.key}`);
        continue;
      }
      
      try {
        const usuarioRaw = await usuariosStore.get(item.key);
        if (!usuarioRaw) continue;
        
        const parsed = JSON.parse(usuarioRaw);
        console.log(`📄 Usuario encontrado: ${item.key}`, { 
          role: parsed.role, 
          name: parsed.name
        });
        
        // Incluir cualquier usuario que no sea psicólogo
        if (parsed.role !== "PSYCHOLOGIST") {
          students.push({
            id: parsed.id || item.key,
            name: parsed.name || parsed.nombre || "Sin nombre",
            email: parsed.email || item.key,
            createdAt: parsed.createdAt || new Date().toISOString()
          });
        }
      } catch (itemError) {
        console.error(`Error procesando ${item.key}:`, itemError);
      }
    }

    console.log(`📊 Alumnos encontrados: ${students.length}`);
    return NextResponse.json(students);
    
  } catch (error) {
    console.error("❌ Error fatal:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("🚀 POST /api/alumnos - Crear nuevo alumno");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const usuariosStore = getStore("usuarios");
    
    const userData = await usuariosStore.get(session.user.email);
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado - Se requiere rol PSYCHOLOGIST" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, matricula, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 });
    }

    const existing = await usuariosStore.get(email);
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name,
      nombre: name,
      email: email,
      matricula: matricula || "",
      password: password || "123456",
      role: "STUDENT",
      createdAt: new Date().toISOString()
    };

    await usuariosStore.setJSON(email, newUser);
    console.log("✅ Alumno creado:", email);

    return NextResponse.json({ 
      success: true, 
      id: newUser.id, 
      name, 
      email 
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Error interno al crear alumno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("🚀 DELETE /api/alumnos - Eliminar alumno");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const usuariosStore = getStore("usuarios");
    
    const userData = await usuariosStore.get(session.user.email);
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await usuariosStore.delete(email);
    console.log("✅ Alumno eliminado:", email);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Error interno al eliminar" }, { status: 500 });
  }
}