import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    // Validar datos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || "STUDENT"
      }
    });

    // ✅ Si el rol es STUDENT, crear automáticamente el registro en Student
    if (user.role === "STUDENT") {
      await prisma.student.create({
        data: {
          email: user.email,
          name: user.name || "Estudiante",
          matricula: null,
          notes: null
        }
      });
      console.log("✅ Estudiante creado automáticamente en tabla Student:", user.email);
    }

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: { email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario: " + (error as Error).message },
      { status: 500 }
    );
  }
}