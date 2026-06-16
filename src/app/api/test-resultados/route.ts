import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🚀 [GET /api/test-resultados] Iniciando...");
    
    const session = await getServerSession();
    console.log("📧 Session email:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("❌ No autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener el rol del usuario desde Prisma
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, name: true }
    });

    if (!currentUser) {
      console.log("❌ Usuario no encontrado en BD");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    console.log("👤 Rol:", currentUser.role, "Usuario:", currentUser.name);

    // Verificar que sea psicólogo
    if (currentUser.role !== "PSYCHOLOGIST") {
      console.log("❌ No autorizado - Se requiere rol PSYCHOLOGIST");
      return NextResponse.json({ 
        error: "No autorizado - Se requiere rol PSYCHOLOGIST",
        yourRole: currentUser.role 
      }, { status: 403 });
    }

    // Obtener todos los resultados de tests desde PostgreSQL (usando TestResult)
    const resultadosDB = await prisma.testResult.findMany({
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
        completedAt: 'desc'
      }
    });

    // Formatear los resultados para el frontend
    const resultados = resultadosDB.map(r => ({
      id: r.id,
      studentName: r.student.name || "Estudiante",
      studentEmail: r.student.email,
      archivoNombre: r.archivoNombre || "Test completado",
      fecha: r.completedAt.toISOString(),
      procesado: true
    }));

    console.log(`📊 Resultados encontrados: ${resultados.length}`);
    return NextResponse.json(resultados);
    
  } catch (error) {
    console.error("❌ Error FATAL en GET /api/test-resultados:", error);
    return NextResponse.json([], { status: 200 });
  }
}