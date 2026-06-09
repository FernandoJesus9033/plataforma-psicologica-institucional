import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const questions = await prisma.testQuestion.findMany({
    orderBy: [{ groupId: "asc" }, { order: "asc" }]
  });

  // Agrupar por groupId
  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.groupId]) acc[q.groupId] = [];
    acc[q.groupId].push(q);
    return acc;
  }, {} as Record<number, typeof questions>);

  return NextResponse.json(grouped);
}