import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { calculateScoresDirectly } from "@/lib/excel/engine/calculateScoresDirectly";
import { obtenerPercentil } from "@/lib/excel/config/tablaPercentiles";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  let student = await prisma.student.findUnique({
    where: { email: user.email }
  });

  if (!student) {
    student = await prisma.student.create({
      data: { email: user.email, name: user.name || "Estudiante" }
    });
  }

  try {
    const body = await req.json();
    const { respuestas } = body;

    if (!respuestas || respuestas.length === 0) {
      return NextResponse.json({ error: "No hay respuestas para procesar" }, { status: 400 });
    }

    console.log("\n========== 📝 NUEVO TEST ==========");
    console.log(`Total de grupos respondidos: ${respuestas.length}`);

    // 🔴 CALCULAR PUNTAJES BRUTOS (PD) DIRECTAMENTE
    console.log("\n--- Cálculo de puntajes por grupo ---");
    const pd = calculateScoresDirectly(respuestas);

    console.log("\n--- 📊 PUNTAJES BRUTOS (PD) FINALES ---");
    console.log(`  Ascendencia (A): ${pd.A}`);
    console.log(`  Responsabilidad (R): ${pd.R}`);
    console.log(`  Estabilidad Emocional (E): ${pd.E}`);
    console.log(`  Sociabilidad (S): ${pd.S}`);
    console.log(`  Autoestima (AE): ${pd.AE}`);
    console.log(`  Cautela (C): ${pd.C}`);
    console.log(`  Originalidad (O): ${pd.O}`);
    console.log(`  Relaciones Interpersonales (P): ${pd.P}`);
    console.log(`  Vigor (V): ${pd.V}`);

    // 🔴 CALCULAR PERCENTILES (PC) USANDO LA TABLA
    console.log("\n--- 🔍 Buscando percentiles en la tabla ---");
    const pc = {
      A: obtenerPercentil("A", pd.A),
      R: obtenerPercentil("R", pd.R),
      E: obtenerPercentil("E", pd.E),
      S: obtenerPercentil("S", pd.S),
      AE: obtenerPercentil("A", pd.AE),
      C: obtenerPercentil("C", pd.C),
      O: obtenerPercentil("O", pd.O),
      P: obtenerPercentil("P", pd.P),
      V: obtenerPercentil("V", pd.V),
    };

    console.log(`  A: PD=${pd.A} → PC=${pc.A}%`);
    console.log(`  R: PD=${pd.R} → PC=${pc.R}%`);
    console.log(`  E: PD=${pd.E} → PC=${pc.E}%`);
    console.log(`  S: PD=${pd.S} → PC=${pc.S}%`);
    console.log(`  AE: PD=${pd.AE} → PC=${pc.AE}%`);
    console.log(`  C: PD=${pd.C} → PC=${pc.C}%`);
    console.log(`  O: PD=${pd.O} → PC=${pc.O}%`);
    console.log(`  P: PD=${pd.P} → PC=${pc.P}%`);
    console.log(`  V: PD=${pd.V} → PC=${pc.V}%`);

    // Guardar en base de datos
    await prisma.testResult.upsert({
      where: { studentId: student.id },
      update: { 
        scores: JSON.stringify(pd), 
        percentiles: JSON.stringify(pc), 
        completedAt: new Date() 
      },
      create: { 
        studentId: student.id, 
        scores: JSON.stringify(pd), 
        percentiles: JSON.stringify(pc), 
        completedAt: new Date() 
      }
    });

    console.log("\n✅ Resultados guardados en BD");
    console.log("====================================\n");

    return NextResponse.json({ 
      success: true, 
      scores: pd,
      percentiles: pc
    });
  } catch (error) {
    console.error("❌ Error al procesar test:", error);
    return NextResponse.json({ error: "Error al procesar el test" }, { status: 500 });
  }
}