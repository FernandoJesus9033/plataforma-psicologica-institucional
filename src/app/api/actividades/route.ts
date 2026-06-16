import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userEmail = session.user.email;
    
    // Obtener el rol del usuario desde Prisma
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    let actividades;

    if (currentUser.role === "PSYCHOLOGIST") {
      // Psicólogo ve todas las actividades
      actividades = await prisma.activity.findMany({
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Estudiante solo ve sus actividades
      actividades = await prisma.activity.findMany({
        where: {
          studentId: userEmail
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json(actividades);
    
  } catch (error) {
    console.error("Error en GET /api/actividades:", error);
    return NextResponse.json({ error: "Error al obtener actividades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userEmail = session.user.email;
    
    // Obtener el rol del usuario desde Prisma
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden crear actividades" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, studentId, dueDate, fileUrl, fileName, fileType } = body;

    if (!title || !studentId) {
      return NextResponse.json({ error: "Título y estudiante son requeridos" }, { status: 400 });
    }

    // Verificar que el estudiante existe
    const estudiante = await prisma.user.findUnique({
      where: { email: studentId }
    });

    if (!estudiante) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    // Crear la actividad en PostgreSQL
    const actividad = await prisma.activity.create({
      data: {
        title,
        description: description || "",
        studentId: studentId,
        psychologistId: currentUser.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        status: "PENDING"
      },
      include: {
        student: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log("✅ Actividad creada:", actividad.id);
    return NextResponse.json(actividad, { status: 201 });
    
  } catch (error) {
    console.error("Error en POST /api/actividades:", error);
    return NextResponse.json({ error: "Error al crear actividad: " + (error as Error).message }, { status: 500 });
  }
}