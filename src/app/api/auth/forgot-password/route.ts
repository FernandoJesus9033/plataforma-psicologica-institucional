import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "El correo electrónico es requerido" }, { status: 400 });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json({ 
        success: true, 
        message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña." 
      });
    }

    // Generar token único
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires }
    });

    // Construir URL de restablecimiento
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // === EN DESARROLLO: Mostrar enlace en consola ===
    console.log("\n🔐 ENLACE DE RESTABLECIMIENTO (DESARROLLO):");
    console.log("================================================");
    console.log(`Usuario: ${user.email}`);
    console.log(`Enlace: ${resetUrl}`);
    console.log("================================================\n");

    // TODO: En producción, descomentar y configurar envío de correo
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Plataforma Psicológica <noreply@tu-dominio.com>",
      to: email,
      subject: "Restablece tu contraseña",
      html: `<div>...</div>`
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: "En desarrollo: Revisa la consola para obtener el enlace de restablecimiento." 
    });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}