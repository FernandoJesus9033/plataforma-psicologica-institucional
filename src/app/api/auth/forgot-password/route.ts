import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

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

    // ✅ No revelar si el usuario existe o no (seguridad)
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña." 
      });
    }

    // Generar token único
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000);

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires }
    });

    // Construir URL de restablecimiento
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // ✅ Verificar que las variables de entorno de correo estén configuradas
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.warn("⚠️ Variables de correo no configuradas. Enlace de recuperación (solo desarrollo):", resetUrl);
      return NextResponse.json({ 
        success: true, 
        message: "En desarrollo: Revisa la consola para obtener el enlace de restablecimiento.",
        resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined
      });
    }

    // Configurar nodemailer con variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Enviar correo
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@tu-dominio.com",
      to: email,
      subject: "Restablece tu contraseña - Plataforma Psicológica",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; font-size: 24px;">🧠 Plataforma Psicológica</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h2 style="color: #1e293b; margin-bottom: 16px;">Restablecer contraseña</h2>
            <p style="color: #475569; margin-bottom: 24px;">Haz clic en el botón para restablecer tu contraseña. Este enlace expira en 1 hora.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Restablecer contraseña</a>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">Si no solicitaste esto, ignora este correo.</p>
          </div>
        </div>
      `
    });

    console.log("✅ Correo de restablecimiento enviado a:", user.email);

    return NextResponse.json({ 
      success: true, 
      message: "Correo enviado. Revisa tu bandeja de entrada." 
    });
    
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}