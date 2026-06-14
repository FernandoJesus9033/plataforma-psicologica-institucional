import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStore } from "@netlify/blobs";
import bcrypt from "bcrypt";

// Obtener todos los alumnos (desde Netlify Blobs)
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
    console.log("🔍 Session completa en POST alumnos:", JSON.stringify(session, null, 2));
    console.log("🔍 Session user:", session?.user);
    console.log("🔍 Session user role:", session?.user?.role);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado - No hay sesión" }, { status: 401 });
    }

    const user = session.user;
    if (!user.role || user.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ 
        error: "No autorizado", 
        detectedRole: user.role || "ninguno",
        message: "Se requiere rol PSYCHOLOGIST"
      }, { status: 403 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 });
    }

    const store = getStore("usuarios");

    // Verificar si el usuario ya existe
    const existingUser = await store.get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password || "123456", 10);
    const userId = crypto.randomUUID();

    // Crear usuario
    const userData = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: role || "STUDENT",
      createdAt: new Date().toISOString()
    };

    await store.setJSON(email, userData);
    await store.setJSON(`id_${userId}`, userData);

    // Crear registro en Student (para compatibilidad)
    if (userData.role === "STUDENT") {
      const studentStore = getStore("students");
      await studentStore.setJSON(email, {
        id: crypto.randomUUID(),
        email: userData.email,
        name: userData.name || "Estudiante",
        matricula: null,
        notes: null,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ id: userId, name, email, role: userData.role }, { status: 201 });
  } catch (error) {
    console.error("Error al crear alumno:", error);
    return NextResponse.json({ error: "Error al crear alumno" }, { status: 500 });
  }
}