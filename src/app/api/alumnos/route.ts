import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("🔍 GET /api/alumnos - Usuario:", session.user?.email);

    // Verificar que el usuario existe en el store
    const usuariosStore = getStore("usuarios");
    const userData = await usuariosStore.get(session.user.email);
    
    if (!userData) {
      console.error("❌ Usuario no encontrado en store:", session.user.email);
      return NextResponse.json({ error: "Usuario no encontrado en el sistema" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    if (currentUser.role !== "PSYCHOLOGIST") {
      console.error("❌ Usuario no es psicólogo:", currentUser.role);
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const store = getStore("usuarios");
    const students: any[] = [];

    try {
      for await (const item of store.list()) {
        try {
          const usuario = await store.get(item.key);
          if (usuario) {
            const parsed = JSON.parse(usuario);
            if (parsed.role === "STUDENT") {
              students.push({
                id: parsed.id,
                name: parsed.name || "Sin nombre",
                email: parsed.email,
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
      console.error("Error al listar store:", listError);
      return NextResponse.json({ error: "Error al leer la base de datos" }, { status: 500 });
    }

    console.log(`📋 Alumnos encontrados: ${students.length}`);
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error en GET alumnos:", error);
    return NextResponse.json({ error: "Error interno del servidor: " + (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener rol del usuario desde el store
    const usuariosStore = getStore("usuarios");
    const userData = await usuariosStore.get(session.user.email);
    
    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    console.log("🔍 Usuario actual:", { email: currentUser.email, role: currentUser.role });
    
    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ 
        error: "No autorizado - Se requiere rol PSYCHOLOGIST",
        yourRole: currentUser.role 
      }, { status: 403 });
    }

    const { name, email, password = "123456" } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 });
    }

    // Verificar si ya existe
    const existing = await usuariosStore.get(email);
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      createdAt: new Date().toISOString()
    };

    await usuariosStore.setJSON(email, newUser);
    console.log("✅ Alumno creado:", email);

    return NextResponse.json({ id: newUser.id, name, email }, { status: 201 });
  } catch (error) {
    console.error("Error al crear alumno:", error);
    return NextResponse.json({ error: "Error interno: " + (error as Error).message }, { status: 500 });
  }
}