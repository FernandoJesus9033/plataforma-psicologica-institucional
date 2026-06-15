import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

// Función auxiliar para diagnosticar el store
async function diagnosticarStore() {
  try {
    const store = getStore("usuarios");
    const items = [];
    for await (const item of store.list()) {
      items.push(item.key);
    }
    console.log("🔍 DIAGNÓSTICO - Keys en store:", items);
    return items;
  } catch (err) {
    console.error("Error en diagnóstico:", err);
    return [];
  }
}

// GET - Obtener todos los alumnos
export async function GET() {
  try {
    console.log("🚀 [GET /api/alumnos] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("📧 Usuario actual:", session.user.email);

    const usuariosStore = getStore("usuarios");
    
    // Verificar que el usuario actual es psicólogo
    let currentUserData;
    try {
      currentUserData = await usuariosStore.get(session.user.email);
    } catch (err) {
      console.error("Error accediendo al store:", err);
      return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
    }
    
    if (!currentUserData) {
      console.error("❌ Usuario no encontrado");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(currentUserData);
    console.log("👤 Rol actual:", currentUser.role);
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Diagnóstico: ver todas las keys del store
    const allKeys = await diagnosticarStore();
    console.log("📋 Todas las keys en el store:", allKeys);

    // Obtener TODOS los usuarios del store
    const students: any[] = [];

    try {
      for await (const item of usuariosStore.list()) {
        // Saltar al usuario actual (psicólogo)
        if (item.key === session.user.email) {
          console.log(`⏭️ Saltando psicólogo: ${item.key}`);
          continue;
        }
        
        try {
          const usuarioRaw = await usuariosStore.get(item.key);
          if (!usuarioRaw) continue;
          
          let parsed;
          try {
            parsed = JSON.parse(usuarioRaw);
          } catch (e) {
            console.error(`❌ Error parseando ${item.key}:`, e);
            continue;
          }
          
          console.log(`📄 Usuario encontrado: ${item.key}`, { 
            role: parsed.role, 
            name: parsed.name,
            email: parsed.email
          });
          
          // CRITERIO: Es alumno si NO es psicólogo
          // (cualquier usuario con rol diferente a PSYCHOLOGIST o sin rol)
          const isPsychologist = parsed.role === "PSYCHOLOGIST";
          
          if (!isPsychologist) {
            students.push({
              id: parsed.id || item.key,
              name: parsed.name || parsed.nombre || "Sin nombre",
              email: parsed.email || item.key,
              createdAt: parsed.createdAt || new Date().toISOString()
            });
          } else {
            console.log(`⏭️ Saltando psicólogo por rol: ${item.key}`);
          }
        } catch (itemError) {
          console.error(`❌ Error procesando ${item.key}:`, itemError);
        }
      }
    } catch (listError) {
      console.error("Error al listar store:", listError);
      return NextResponse.json([]);
    }

    console.log(`📊 Alumnos encontrados: ${students.length}`);
    students.forEach(s => console.log(`   - ${s.name} (${s.email})`));
    
    return NextResponse.json(students);
    
  } catch (error) {
    console.error("❌ Error en GET alumnos:", error);
    return NextResponse.json([]);
  }
}

// POST - Crear nuevo alumno
export async function POST(req: Request) {
  try {
    console.log("🚀 [POST /api/alumnos] Iniciando...");
    
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
      return NextResponse.json({ 
        error: "No autorizado - Se requiere rol PSYCHOLOGIST"
      }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, matricula, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 });
    }

    // Verificar si ya existe
    const existing = await usuariosStore.get(email);
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    // Crear nuevo alumno
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
      email,
      message: "Alumno creado correctamente" 
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error al crear alumno:", error);
    return NextResponse.json({ error: "Error interno al crear alumno" }, { status: 500 });
  }
}

// DELETE - Eliminar alumno
export async function DELETE(req: Request) {
  try {
    console.log("🚀 [DELETE /api/alumnos] Iniciando...");
    
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
    console.error("❌ Error al eliminar alumno:", error);
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 });
  }
}