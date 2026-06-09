import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession();
  if (!session || session.user?.role !== "PSYCHOLOGIST") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" }
  });

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    const existing = await prisma.student.findUnique({
      where: { email: user.email }
    });
    
    if (!existing && user.name) {
      await prisma.student.create({
        data: {
          name: user.name,
          email: user.email
        }
      });
      created++;
    } else {
      skipped++;
    }
  }

  return NextResponse.json({ 
    message: "Estudiantes sincronizados",
    created,
    skipped,
    total: users.length
  });
}