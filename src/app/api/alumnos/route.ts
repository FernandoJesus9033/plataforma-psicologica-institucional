import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET - Obtener todos los alumnos
export async function GET() {
  try {
    console.log("🚀 GET /api/alumnos - Obteniendo alumnos de PostgreSQL");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que sea psicólogo
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener alumnos de PostgreSQL
    const alumnos = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ ${alumnos.length} alumnos encontrados`);
    return NextResponse.json(alumnos);
    
  } catch (error) {
    console.error("❌ Error en GET /api/alumnos:", error);
    return NextResponse.json(
      { error: "Error al obtener alumnos" }, 
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo alumno
export async function POST(req: Request) {
  try {
    console.log("🚀 POST /api/alumnos - Creando alumno");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que sea psicólogo
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden crear alumnos" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, matricula, password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y correo son requeridos" }, 
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está registrado" }, 
        { status: 400 }
      );
    }

    // Encriptar contraseña (usar "123456" por defecto si no se proporciona)
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Crear usuario con rol STUDENT
    const nuevoUsuario = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "STUDENT"
      }
    });

    // Crear el registro Student asociado
    await prisma.student.create({
      data: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        name: nuevoUsuario.name || "Estudiante",
        matricula: matricula || null,
        notes: null
      }
    });

    console.log("✅ Alumno creado:", nuevoUsuario.email);
    
    return NextResponse.json({ 
      success: true, 
      id: nuevoUsuario.id,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
      createdAt: nuevoUsuario.createdAt
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error en POST /api/alumnos:", error);
    return NextResponse.json(
      { error: "Error al crear alumno" }, 
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un alumno por email
export async function DELETE(req: Request) {
  try {
    console.log("🚀 DELETE /api/alumnos");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" }, 
        { status: 400 }
      );
    }

    // Verificar que sea psicólogo
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Buscar el alumno
    const alumno = await prisma.user.findUnique({
      where: { email }
    });

    if (!alumno || alumno.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Alumno no encontrado" }, 
        { status: 404 }
      );
    }

    // Eliminar Student y User
    await prisma.student.delete({
      where: { email }
    }).catch(() => {});

    await prisma.user.delete({
      where: { email }
    });

    console.log("✅ Alumno eliminado:", email);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error en DELETE /api/alumnos:", error);
    return NextResponse.json(
      { error: "Error al eliminar alumno" }, 
      { status: 500 }
    );
  }
}