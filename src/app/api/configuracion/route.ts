import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    let config = await prisma.configuracion.findUnique({
      where: { userId: user.id }
    });

    if (!config) {
      config = await prisma.configuracion.create({
        data: {
          userId: user.id,
          notificaciones: true,
          tema: "claro",
          idioma: "es"
        }
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error en GET /api/configuracion:", error);
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { notificaciones, tema, idioma } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const config = await prisma.configuracion.upsert({
      where: { userId: user.id },
      update: { notificaciones, tema, idioma },
      create: {
        userId: user.id,
        notificaciones,
        tema,
        idioma
      }
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error en PUT /api/configuracion:", error);
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 });
  }
}