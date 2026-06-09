import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "La cuenta ya fue verificada" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null
      }
    });

    return NextResponse.json({ message: "Cuenta verificada exitosamente" });
  } catch (error) {
    console.error("Error en verificación:", error);
    return NextResponse.json(
      { error: "Error al verificar la cuenta" },
      { status: 500 }
    );
  }
}