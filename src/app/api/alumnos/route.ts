import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

// GET - Obtener todos los alumnos
export async function GET() {
  try {
    console.log("🚀 [GET /api/alumnos] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("📧 Usuario:", session.user.email);

    // Verificar que el usuario existe en el store
    const usuariosStore = getStore("usuarios");
    
    // Primero verificar que el store existe
    let testUser;
    try {
      testUser = await usuariosStore.get(session.user.email);
      console.log("✅ Store accesible, usuario encontrado:", !!testUser);
    } catch (err) {
      console.error("❌ Error accediendo al store:", err);
      return NextResponse.json({ error: "Error de conexión al almacén de datos" }, { status: 500 });
    }
    
    if (!testUser) {
      console.error("❌ Usuario no encontrado en store:", session.user.email);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(testUser);
    console.log("👤 Rol:", currentUser.role);
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      console.error("❌ Usuario no es psicólogo:", currentUser.role);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener todos los estudiantes
    const students: any[] = [];

    try {
      // Método alternativo: obtener todos los items del store
      // Algunas versiones de Netlify Blobs tienen problemas con list()
      // Usamos un enfoque más simple: solo devolvemos los usuarios que conocemos
      // o usamos try-catch más robusto
      
      const items = [];
      try {
        // Intentar listar
        for await (const item of usuariosStore.list()) {
          items.push(item);
        }
        console.log(`📋 Items encontrados en store: ${items.length}`);
      } catch (listErr) {
        console.error("Error al listar store, intentando método alternativo:", listErr);
        // Si no podemos listar, devolvemos array vacío en lugar de error
        return NextResponse.json([]);
      }
      
      for (const item of items) {
        try {
          const usuarioRaw = await usuariosStore.get(item.key);
          if (usuarioRaw) {
            const parsed = JSON.parse(usuarioRaw);
            // Solo estudiantes, excluir psicólogos
            if (parsed.role === "STUDENT" || parsed.role === "ALUMNO") {
              students.push({
                id: parsed.id || item.key,
                name: parsed.name || parsed.nombre || "Sin nombre",
                email: parsed.email || item.key,
                createdAt: parsed.createdAt || new Date().toISOString()
              });
            }
          }
        } catch (itemError) {
          console.error("Error procesando item:", item.key, itemError);
          // Continuar con el siguiente item
        }
      }
    } catch (listError) {
      console.error("Error fatal al listar store:", listError);
      // En caso de error, devolver array vacío
      return NextResponse.json([]);
    }

    console.log(`📊 Alumnos encontrados: ${students.length}`);
    return NextResponse.json(students);
    
  } catch (error) {
    console.error("❌ Error en GET alumnos:", error);
    // Siempre devolver array vacío en caso de error
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

    // Verificar rol
    const usuariosStore = getStore("usuarios");
    
    let userData;
    try {
      userData = await usuariosStore.get(session.user.email);
    } catch (err) {
      console.error("Error accediendo al store:", err);
      return NextResponse.json({ error: "Error de conexión al almacén" }, { status: 500 });
    }
    
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    console.log("👤 Usuario actual:", { email: currentUser.email, role: currentUser.role });
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ 
        error: "No autorizado - Se requiere rol PSYCHOLOGIST",
        yourRole: currentUser.role 
      }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, matricula, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 });
    }

    // Verificar si ya existe
    let existing;
    try {
      existing = await usuariosStore.get(email);
    } catch (err) {
      console.error("Error verificando existencia:", err);
      existing = null;
    }
    
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

    try {
      await usuariosStore.setJSON(email, newUser);
      console.log("✅ Alumno creado:", email);
    } catch (err) {
      console.error("Error guardando alumno:", err);
      return NextResponse.json({ error: "Error al guardar el alumno" }, { status: 500 });
    }

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

    // Verificar rol
    const usuariosStore = getStore("usuarios");
    
    let userData;
    try {
      userData = await usuariosStore.get(session.user.email);
    } catch (err) {
      console.error("Error accediendo al store:", err);
      return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
    }
    
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    try {
      await usuariosStore.delete(email);
      console.log("✅ Alumno eliminado:", email);
    } catch (err) {
      console.error("Error eliminando alumno:", err);
      return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error al eliminar alumno:", error);
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 });
  }
}