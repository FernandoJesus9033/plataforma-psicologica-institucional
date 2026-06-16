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
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    let actividades;

    if (currentUser.role === "PSYCHOLOGIST") {
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
      const student = await prisma.student.findUnique({
        where: { email: userEmail },
        select: { id: true }
      });

      if (!student) {
        return NextResponse.json([], { status: 200 });
      }

      actividades = await prisma.activity.findMany({
        where: {
          studentId: student.id
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
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (currentUser.role !== "PSYCHOLOGIST") {
      return NextResponse.json({ error: "No autorizado. Solo psicólogos pueden crear actividades" }, { status: 403 });
    }

    const body = await req.json();
    console.log("📝 Datos recibidos para actividad:", body);

    const { title, description, studentId, dueDate, fileUrl, fileName, fileType } = body;

    if (!title) {
      return NextResponse.json({ error: "Faltan datos: Título es requerido" }, { status: 400 });
    }

    if (!studentId) {
      return NextResponse.json({ error: "Faltan datos: Estudiante es requerido" }, { status: 400 });
    }

    if (!dueDate) {
      return NextResponse.json({ error: "Faltan datos: Fecha límite es requerida" }, { status: 400 });
    }

    // ✅ Verificar que el estudiante existe en User
    const estudiante = await prisma.user.findFirst({
      where: {
        OR: [
          { id: studentId },
          { email: studentId }
        ],
        role: "STUDENT"
      },
      select: { id: true, email: true, name: true }
    });

    if (!estudiante) {
      console.log("❌ Estudiante no encontrado en User:", studentId);
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    // ✅ Verificar que el estudiante existe en Student
    // Si no existe, crearlo con el mismo ID que User
    let estudianteStudent = await prisma.student.findUnique({
      where: { email: estudiante.email },
      select: { id: true }
    });

    if (!estudianteStudent) {
      console.log("⚠️ Estudiante no encontrado en Student, creando...");
      await prisma.student.create({
        data: {
          id: estudiante.id,  // ✅ Usa el mismo ID que User
          email: estudiante.email,
          name: estudiante.name || "Estudiante",
          matricula: null,
          notes: null
        }
      });
      estudianteStudent = { id: estudiante.id };
      console.log("✅ Estudiante creado en Student con ID:", estudianteStudent.id);
    }

    console.log("✅ Usando studentId:", estudianteStudent.id);

    // ✅ Crear la actividad con el ID de Student
    const actividad = await prisma.activity.create({
      data: {
        title,
        description: description || "",
        studentId: estudianteStudent.id,  // ✅ Usa el ID de Student
        psychologistId: currentUser.id,
        dueDate: new Date(dueDate),
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