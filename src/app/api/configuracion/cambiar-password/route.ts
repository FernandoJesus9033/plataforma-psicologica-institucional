import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    // Validar que el email existe
    if (!session.user.email) {
      return NextResponse.json({ error: "Email no válido" }, { status: 401 });
    }

    // Buscar usuario en PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValid) {
      return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña en PostgreSQL
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    });

    console.log("✅ Contraseña actualizada para:", session.user.email);

    return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    return NextResponse.json({ error: "Error al cambiar la contraseña" }, { status: 500 });
  }
}