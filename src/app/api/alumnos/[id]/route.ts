import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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
    
    // Buscar alumno por id o email en PostgreSQL
    let alumno = await prisma.user.findFirst({
      where: {
        OR: [
          { id: id },
          { email: id }
        ],
        role: "STUDENT" // Solo estudiantes
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    if (!alumno) {
      console.log("❌ Alumno no encontrado:", id);
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }
    
    // Obtener datos adicionales del estudiante (matrícula, notas)
    const estudiante = await prisma.student.findUnique({
      where: { email: alumno.email },
      select: {
        matricula: true,
        notes: true
      }
    });
    
    const alumnoEncontrado = {
      id: alumno.id,
      name: alumno.name || "Sin nombre",
      email: alumno.email,
      matricula: estudiante?.matricula || "",
      notes: estudiante?.notes || "",
      createdAt: alumno.createdAt.toISOString()
    };
    
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
    const { name, email, matricula, notes } = body;
    
    console.log("✏️ Actualizando alumno:", id, { name, email, matricula });
    
    // Buscar el alumno actual en PostgreSQL
    const alumnoExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { id: id },
          { email: id }
        ],
        role: "STUDENT"
      }
    });
    
    if (!alumnoExistente) {
      console.log("❌ Alumno no encontrado para actualizar:", id);
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }
    
    // Actualizar datos del usuario
    const alumnoActualizado = await prisma.user.update({
      where: { id: alumnoExistente.id },
      data: {
        name: name,
        email: email || alumnoExistente.email
      }
    });
    
    // Actualizar datos del estudiante (matrícula, notas)
    await prisma.student.update({
      where: { email: alumnoExistente.email },
      data: {
        matricula: matricula || null,
        notes: notes || null,
        ...(email && email !== alumnoExistente.email ? { email: email } : {})
      }
    });
    
    console.log("✅ Alumno actualizado:", alumnoActualizado.name);
    return NextResponse.json({ 
      success: true, 
      id: alumnoActualizado.id,
      name: alumnoActualizado.name,
      email: alumnoActualizado.email,
      matricula: matricula || ""
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
    
    // Buscar el alumno primero
    const alumno = await prisma.user.findFirst({
      where: {
        OR: [
          { id: id },
          { email: id }
        ],
        role: "STUDENT"
      }
    });
    
    if (!alumno) {
      console.log("❌ Alumno no encontrado para eliminar:", id);
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }
    
    // Eliminar en orden (primero registros relacionados, luego el usuario)
    // Primero eliminar el estudiante (Student)
    await prisma.student.delete({
      where: { email: alumno.email }
    }).catch(() => console.log("Student no encontrado o ya eliminado"));
    
    // Luego eliminar el usuario (User)
    await prisma.user.delete({
      where: { id: alumno.id }
    });
    
    console.log("✅ Alumno eliminado:", alumno.name, "(", alumno.email, ")");
    
    return NextResponse.json({ success: true, message: "Alumno eliminado correctamente" });
    
  } catch (error) {
    console.error("❌ Error en DELETE /api/alumnos/[id]:", error);
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 });
  }
}