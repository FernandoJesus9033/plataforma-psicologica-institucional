import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
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

    // Conectar al almacenamiento de Netlify
    const store = getStore("usuarios");

    // Verificar si el usuario ya existe
    const existingUser = await store.get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userData = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      name: name || null,
      role: role || "STUDENT",
      createdAt: new Date().toISOString(),
    };

    await store.setJSON(email, userData);

    // ✅ Si el rol es STUDENT, crear automáticamente el registro en Student
    if (userData.role === "STUDENT") {
      const studentData = {
        id: crypto.randomUUID(),
        email: userData.email,
        name: userData.name || "Estudiante",
        matricula: null,
        notes: null,
        createdAt: new Date().toISOString(),
      };
      await store.setJSON(`student_${email}`, studentData);
      console.log("✅ Estudiante creado automáticamente en Netlify Blobs:", userData.email);
    }

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: { email: userData.email, name: userData.name, role: userData.role } },
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