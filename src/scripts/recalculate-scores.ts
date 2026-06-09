import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Cambia este email por el del estudiante
  const studentEmail = "elcachcolli@gmail.com"
  
  const student = await prisma.student.findFirst({
    where: { email: studentEmail },
    include: { testResponses: true }
  })

  if (!student) {
    console.log("Estudiante no encontrado")
    return
  }

  console.log(`Estudiante: ${student.name}`)
  console.log(`Respuestas encontradas: ${student.testResponses.length}`)

  // Aquí iría la lógica de cálculo
  // Por ahora, creamos un puntaje de prueba
  const testScores = {
    A: 16, R: 6, E: 7, S: 15,
    AE: 0, C: 0, O: 0, P: 0, V: 0
  }

  await prisma.testResult.upsert({
    where: { studentId: student.id },
    update: { scores: JSON.stringify(testScores) },
    create: {
      studentId: student.id,
      scores: JSON.stringify(testScores),
      percentiles: "{}"
    }
  })

  console.log("✅ Puntajes actualizados:", testScores)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())