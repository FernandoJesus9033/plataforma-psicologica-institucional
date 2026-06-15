import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";
import bcrypt from "bcrypt";

// Obtener todos los alumnos
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = getStore("usuarios");
    const students: any[] = [];

    for await (const item of store.list()) {
      const usuario = await store.get(item.key);
      if (usuario) {
        const parsed = JSON.parse(usuario);
        if (parsed.role === "STUDENT") {
          students.push({
            id: parsed.id,
            name: parsed.name,
            email: parsed.email,
            createdAt: parsed.createdAt
          });
        }
      }
    }

    console.log(`📋 Alumnos encontrados: ${students.length}`);
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    return NextResponse.json({ error: "Error al obtener alumnos" }, { status: 500 });
  }
}

// Crear nuevo alumno
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
      return NextResponse.json({ error: "Usuario no encontrado en store" }, { status: 404 });
    }
    
    const currentUser = JSON.parse(userData);
    
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
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}