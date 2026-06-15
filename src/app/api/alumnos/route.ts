import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";

export async function GET() {
  try {
    console.log("🚀 GET /api/alumnos");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const usuariosStore = getStore("usuarios");
    
    // Verificar que es psicólogo
    const currentUserRaw = await usuariosStore.get(session.user.email);
    if (!currentUserRaw) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(currentUserRaw);
    console.log("👤 Usuario actual:", currentUser.email, "Rol:", currentUser.role);
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado - Se requiere rol PSYCHOLOGIST" }, { status: 403 });
    }

    // Obtener TODOS los usuarios (excepto el psicólogo actual)
    const students: any[] = [];
    let totalItems = 0;

    for await (const item of usuariosStore.list()) {
      totalItems++;
      console.log(`📄 Procesando: ${item.key}`);
      
      // Saltar al psicólogo actual
      if (item.key === session.user.email) {
        console.log(`⏭️ Saltando psicólogo: ${item.key}`);
        continue;
      }
      
      try {
        const usuarioRaw = await usuariosStore.get(item.key);
        if (!usuarioRaw) {
          console.log(`⚠️ Usuario vacío: ${item.key}`);
          continue;
        }
        
        let parsed;
        try {
          parsed = JSON.parse(usuarioRaw);
        } catch (e) {
          console.error(`❌ Error parseando ${item.key}:`, e);
          continue;
        }
        
        console.log(`✅ Usuario: ${item.key}`, { 
          role: parsed.role, 
          name: parsed.name,
          email: parsed.email
        });
        
        // CRITERIO: Es alumno si NO es psicólogo
        // (incluye usuarios con role STUDENT, ALUMNO, o sin role)
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

    console.log(`📊 Total items en store: ${totalItems}`);
    console.log(`📊 Alumnos encontrados: ${students.length}`);
    students.forEach(s => console.log(`   - ${s.name} (${s.email})`));
    
    return NextResponse.json(students);
    
  } catch (error) {
    console.error("❌ Error fatal en GET /api/alumnos:", error);
    return NextResponse.json([]);
  }
}

// POST - Crear nuevo alumno
export async function POST(req: Request) {
  try {
    console.log("🚀 POST /api/alumnos - Crear nuevo alumno");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const usuariosStore = getStore("usuarios");
    
    // Verificar que el usuario actual es psicólogo
    const userData = await usuariosStore.get(session.user.email);
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    console.log("👤 Usuario actual:", currentUser.email, "Rol:", currentUser.role);
    
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

    // Verificar si ya existe un usuario con ese email
    const existing = await usuariosStore.get(email);
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    // Crear nuevo alumno con role STUDENT
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
    console.log("✅ Alumno creado exitosamente:", email);

    return NextResponse.json({ 
      success: true, 
      id: newUser.id, 
      name, 
      email,
      message: "Alumno creado correctamente"
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error en POST /api/alumnos:", error);
    return NextResponse.json({ error: "Error interno al crear alumno" }, { status: 500 });
  }
}

// DELETE - Eliminar alumno
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
    
    // Verificar que el usuario actual es psicólogo
    const userData = await usuariosStore.get(session.user.email);
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    console.log("👤 Usuario actual:", currentUser.email, "Rol:", currentUser.role);
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado - Se requiere rol PSYCHOLOGIST" }, { status: 403 });
    }

    // Verificar que el alumno existe
    const alumnoExists = await usuariosStore.get(email);
    if (!alumnoExists) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    await usuariosStore.delete(email);
    console.log("✅ Alumno eliminado exitosamente:", email);

    return NextResponse.json({ 
      success: true,
      message: "Alumno eliminado correctamente"
    });
    
  } catch (error) {
    console.error("❌ Error en DELETE /api/alumnos:", error);
    return NextResponse.json({ error: "Error interno al eliminar alumno" }, { status: 500 });
  }
}