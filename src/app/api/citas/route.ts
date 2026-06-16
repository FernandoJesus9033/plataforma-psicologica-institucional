import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// Helper para obtener el rol del usuario desde Prisma
async function getUserRole(email: string): Promise<string> {
  if (!email) return "STUDENT";
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    });
    return user?.role || "STUDENT";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "STUDENT";
  }
}

// GET - Obtener citas
export async function GET() {
  try {
    console.log("🚀 [GET /api/citas] Iniciando...");
    
    const session = await getServerSession();
    console.log("📧 Session email:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userRole = await getUserRole(userEmail);
    console.log("👤 Rol:", userRole);

    let citas;
    
    if (userRole === "PSYCHOLOGIST") {
      // Psicólogo ve todas las citas con información del estudiante
      citas = await prisma.appointment.findMany({
        include: {
          student: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      // Formatear para el frontend
      const resultado = citas.map(c => ({
        id: c.id,
        fecha: c.date.toISOString().split('T')[0],
        hora: c.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        motivo: c.motivo || "Sin motivo",
        estado: c.status,
        studentName: c.student.name || "Estudiante",
        studentEmail: c.student.email
      }));
      
      console.log("📤 Enviando:", resultado.length, "citas para psicólogo");
      return NextResponse.json(resultado);
      
    } else {
      // Estudiante solo ve sus propias citas
      // Primero obtener el estudiante por email
      const estudiante = await prisma.student.findUnique({
        where: { email: userEmail }
      });

      if (!estudiante) {
        console.log("❌ Estudiante no encontrado:", userEmail);
        return NextResponse.json([], { status: 200 });
      }

      citas = await prisma.appointment.findMany({
        where: {
          studentId: estudiante.id
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      const resultado = citas.map(c => ({
        id: c.id,
        fecha: c.date.toISOString().split('T')[0],
        hora: c.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        motivo: c.motivo || "Sin motivo",
        estado: c.status,
        studentName: session.user.name || "Estudiante",
        studentEmail: userEmail
      }));
      
      console.log("📤 Enviando:", resultado.length, "citas para estudiante");
      return NextResponse.json(resultado);
    }
    
  } catch (error) {
    console.error("❌ Error FATAL en GET /api/citas:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Crear nueva cita
export async function POST(req: Request) {
  try {
    console.log("🚀 [POST /api/citas] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.email);
    if (userRole !== "STUDENT") {
      return NextResponse.json({ error: "Solo estudiantes pueden solicitar citas" }, { status: 403 });
    }

    // Obtener el estudiante por email
    const estudiante = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    if (!estudiante) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { date, motivo } = body;

    if (!date) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
    }

    const fechaObj = new Date(date);

    // Crear la cita en PostgreSQL
    const nuevaCita = await prisma.appointment.create({
      data: {
        studentId: estudiante.id,
        date: fechaObj,
        motivo: motivo || "Sin motivo",
        status: "PENDING"
      }
    });

    console.log("✅ Cita creada:", nuevaCita.id);
    
    // Formatear para el frontend
    const respuesta = {
      id: nuevaCita.id,
      fecha: nuevaCita.date.toISOString().split('T')[0],
      hora: nuevaCita.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      motivo: nuevaCita.motivo,
      estado: nuevaCita.status,
      studentName: session.user.name || "Estudiante",
      studentEmail: session.user.email
    };

    return NextResponse.json(respuesta, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error en POST /api/citas:", error);
    return NextResponse.json({ error: "Error al crear la cita" }, { status: 500 });
  }
}

// PATCH - Actualizar estado de una cita
export async function PATCH(req: Request) {
  try {
    console.log("🚀 [PATCH /api/citas] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.email);
    if (userRole !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID y status requeridos" }, { status: 400 });
    }

    // Verificar que la cita existe
    const citaExistente = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!citaExistente) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    // Actualizar el estado
    const citaActualizada = await prisma.appointment.update({
      where: { id },
      data: { status: status }
    });

    console.log("✅ Cita actualizada:", id, status);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error en PATCH /api/citas:", error);
    return NextResponse.json({ error: "Error al actualizar la cita" }, { status: 500 });
  }
}

// DELETE - Eliminar cita
export async function DELETE(req: Request) {
  try {
    console.log("🚀 [DELETE /api/citas] Iniciando...");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const userRole = await getUserRole(session.user.email);
    
    // Verificar que la cita existe
    const cita = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!cita) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }
    
    // Verificar permisos
    if (userRole !== "PSYCHOLOGIST") {
      // Si es estudiante, verificar que sea su cita
      const estudiante = await prisma.student.findUnique({
        where: { email: session.user.email }
      });
      
      if (!estudiante || cita.studentId !== estudiante.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    // Eliminar la cita
    await prisma.appointment.delete({
      where: { id }
    });
    
    console.log("✅ Cita eliminada:", id);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Error en DELETE /api/citas:", error);
    return NextResponse.json({ error: "Error al eliminar la cita" }, { status: 500 });
  }
}