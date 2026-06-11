import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

// Obtener todos los alumnos (desde la tabla User con rol STUDENT)
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT"
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

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

    const { name, email, password, role } = await req.json();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT"
      }
    });

    // Crear registro en la tabla Student (si es estudiante)
    if (user.role === "STUDENT") {
      await prisma.student.create({
        data: {
          email: user.email,
          name: user.name || "Estudiante",
          matricula: null,
          notes: null
        }
      });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error al crear alumno:", error);
    return NextResponse.json({ error: "Error al crear alumno" }, { status: 500 });
  }
}