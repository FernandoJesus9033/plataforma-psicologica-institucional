import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  // Grupo 1
  { groupId: 1, text: "es bastante sociable", scale: "A", order: 0 },
  { groupId: 1, text: "le falta confianza en sí mismo(a)", scale: "R", order: 1 },
  { groupId: 1, text: "es perfeccionista con cualquier trabajo que realiza", scale: "C", order: 2 },
  { groupId: 1, text: "tiende a ser algo emocional", scale: "O", order: 3 },
  // Grupo 2
  { groupId: 2, text: "no le interesa estar con otras personas", scale: "A", order: 0 },
  { groupId: 2, text: "se siente libre de ansiedades y tensiones", scale: "R", order: 1 },
  { groupId: 2, text: "es una persona poco confiable", scale: "C", order: 2 },
  { groupId: 2, text: "toma la conducción en las discusiones de grupo", scale: "O", order: 3 },
  // Grupo 3
  { groupId: 3, text: "actúa de manera nerviosa e inestable", scale: "A", order: 0 },
  { groupId: 3, text: "tiene una gran influencia sobre los demás", scale: "R", order: 1 },
  { groupId: 3, text: "no le gustan las reuniones sociales", scale: "E", order: 2 },
  { groupId: 3, text: "es un(a) trabajador(a) muy persistente y formal", scale: "S", order: 3 },
  // Grupo 4
  { groupId: 4, text: "se le facilita hacer nuevas amistades", scale: "A", order: 0 },
  { groupId: 4, text: "no puede realizar la misma tarea por mucho tiempo", scale: "R", order: 1 },
  { groupId: 4, text: "es fácilmente manejado(a) por los demás", scale: "E", order: 2 },
  { groupId: 4, text: "mantiene el autocontrol aun si está frustrado(a)", scale: "S", order: 3 },
  // Grupo 5
  { groupId: 5, text: "es capaz de tomar decisiones importantes sin ayuda", scale: "A", order: 0 },
  { groupId: 5, text: "no se relaciona fácilmente con gente desconocida", scale: "R", order: 1 },
  { groupId: 5, text: "tiende a sentirse tenso(a) o muy presionado(a)", scale: "E", order: 2 },
  { groupId: 5, text: "concluye su trabajo a pesar de los problemas", scale: "S", order: 3 },
  // Grupo 6
  { groupId: 6, text: "no le interesa mucho ser sociable", scale: "A", order: 0 },
  { groupId: 6, text: "no toma en serio sus responsabilidades", scale: "R", order: 1 },
  { groupId: 6, text: "se mantiene estable y sereno(a)", scale: "E", order: 2 },
  { groupId: 6, text: "toma el mando en actividades de grupo", scale: "S", order: 3 },
  // Grupo 7
  { groupId: 7, text: "es una persona en quien se puede confiar", scale: "A", order: 0 },
  { groupId: 7, text: "se disgusta fácilmente cuando las cosas van mal", scale: "R", order: 1 },
  { groupId: 7, text: "no se siente muy seguro(a) de sus propias opiniones", scale: "E", order: 2 },
  { groupId: 7, text: "prefiere estar cerca de la gente", scale: "S", order: 3 },
  // Grupo 8
  { groupId: 8, text: "le resulta fácil influir en los demás", scale: "A", order: 0 },
  { groupId: 8, text: "termina su trabajo a pesar de los obstáculos", scale: "R", order: 1 },
  { groupId: 8, text: "limita sus relaciones sociales a unos cuantos", scale: "E", order: 2 },
  { groupId: 8, text: "tiende a ser una persona más bien nerviosa", scale: "S", order: 3 },
  // Grupo 9
  { groupId: 9, text: "no hace amigos fácilmente", scale: "A", order: 0 },
  { groupId: 9, text: "toma parte activa en los asuntos de grupo", scale: "R", order: 1 },
  { groupId: 9, text: "persiste en tareas rutinarias hasta concluirlas", scale: "E", order: 2 },
  { groupId: 9, text: "no se encuentra emocionalmente equilibrado(a)", scale: "S", order: 3 },
  // Grupo 10
  { groupId: 10, text: "se siente seguro(a) en sus relaciones con los demás", scale: "A", order: 0 },
  { groupId: 10, text: "sus sentimientos son heridos fácilmente", scale: "R", order: 1 },
  { groupId: 10, text: "tiene hábitos de trabajo bien desarrollados", scale: "E", order: 2 },
  { groupId: 10, text: "prefiere conservar un grupo pequeño de amigos", scale: "S", order: 3 },
  // Grupo 11
  { groupId: 11, text: "se irrita con facilidad", scale: "A", order: 0 },
  { groupId: 11, text: "es capaz de manejar cualquier situación", scale: "R", order: 1 },
  { groupId: 11, text: "no le gusta conversar con extraños", scale: "E", order: 2 },
  { groupId: 11, text: "es perfeccionista en el trabajo que realiza", scale: "S", order: 3 },
  // Grupo 12
  { groupId: 12, text: "prefiere no discutir con los demás", scale: "A", order: 0 },
  { groupId: 12, text: "es incapaz de mantener un horario fijo", scale: "R", order: 1 },
  { groupId: 12, text: "es una persona tranquila y serena", scale: "E", order: 2 },
  { groupId: 12, text: "tiende a ser muy sociable", scale: "S", order: 3 },
  // Grupo 13
  { groupId: 13, text: "se siente libre de inquietudes y preocupaciones", scale: "A", order: 0 },
  { groupId: 13, text: "le falta sentido de responsabilidad", scale: "R", order: 1 },
  { groupId: 13, text: "no le interesa relacionarse con el sexo opuesto", scale: "E", order: 2 },
  { groupId: 13, text: "es hábil para tratar a otras personas", scale: "S", order: 3 },
  // Grupo 14
  { groupId: 14, text: "le resulta fácil ser amistoso(a)", scale: "A", order: 0 },
  { groupId: 14, text: "prefiere que otros dirijan las actividades de grupo", scale: "R", order: 1 },
  { groupId: 14, text: "parece estar siempre preocupado(a)", scale: "E", order: 2 },
  { groupId: 14, text: "persevera en un trabajo a pesar de los problemas", scale: "S", order: 3 },
  // Grupo 15
  { groupId: 15, text: "es capaz de cambiar las opiniones de otros", scale: "A", order: 0 },
  { groupId: 15, text: "no le interesa unirse a actividades grupales", scale: "R", order: 1 },
  { groupId: 15, text: "es una persona muy nerviosa", scale: "E", order: 2 },
  { groupId: 15, text: "es muy persistente en el trabajo que realiza", scale: "S", order: 3 },
  // Grupo 16
  { groupId: 16, text: "es calmado(a) y fácil de tratar", scale: "A", order: 0 },
  { groupId: 16, text: "no puede perseverar en el trabajo que realiza", scale: "R", order: 1 },
  { groupId: 16, text: "disfruta rodeándose de mucha gente", scale: "E", order: 2 },
  { groupId: 16, text: "no confía mucho en sus propias habilidades", scale: "S", order: 3 },
  // Grupo 17
  { groupId: 17, text: "es una persona totalmente confiable", scale: "A", order: 0 },
  { groupId: 17, text: "no le interesa la compañía de la mayoría de la gente", scale: "R", order: 1 },
  { groupId: 17, text: "le resulta difícil relajarse", scale: "E", order: 2 },
  { groupId: 17, text: "toma parte activa en las discusiones de grupo", scale: "S", order: 3 },
  // Grupo 18
  { groupId: 18, text: "no se deja vencer fácilmente por un problema", scale: "A", order: 0 },
  { groupId: 18, text: "tiende a ser algo nervioso(a)", scale: "R", order: 1 },
  { groupId: 18, text: "carece de seguridad en sí mismo(a)", scale: "E", order: 2 },
  { groupId: 18, text: "prefiere pasar el tiempo en compañía de otros", scale: "S", order: 3 },
  // Grupo 19
  { groupId: 19, text: "tiene ideas muy originales", scale: "A", order: 0 },
  { groupId: 19, text: "cree que toda la gente es esencialmente honesta", scale: "R", order: 1 },
  { groupId: 19, text: "es una persona muy activa", scale: "E", order: 2 },
  { groupId: 19, text: "disfruta las discusiones filosóficas", scale: "S", order: 3 },
  // Grupo 20
  { groupId: 20, text: "le gusta trabajar principalmente con ideas", scale: "A", order: 0 },
  { groupId: 20, text: "se distingue por arriesgarse", scale: "R", order: 1 },
  { groupId: 20, text: "es una persona muy paciente", scale: "E", order: 2 },
  { groupId: 20, text: "se siente cansado(a) y fastidiado(a) al final del día", scale: "S", order: 3 },
  // Grupo 21
  { groupId: 21, text: "no actúa impulsivamente", scale: "A", order: 0 },
  { groupId: 21, text: "tiende a disgustarse mucho con la gente", scale: "R", order: 1 },
  { groupId: 21, text: "es una persona muy cautelosa", scale: "E", order: 2 },
  { groupId: 21, text: "prefiere trabajar despacio", scale: "S", order: 3 },
  // Grupo 22
  { groupId: 22, text: "es muy diplomático(a) y discreto(a)", scale: "A", order: 0 },
  { groupId: 22, text: "prefiere no ocupar su mente en pensamientos profundos", scale: "R", order: 1 },
  { groupId: 22, text: "pierde la paciencia con los demás rápidamente", scale: "E", order: 2 },
  { groupId: 22, text: "tiene menos resistencia que la mayoría de la gente", scale: "S", order: 3 },
  // Grupo 23
  { groupId: 23, text: "tiende a ser creativo(a) y original", scale: "A", order: 0 },
  { groupId: 23, text: "no le interesa mucho lo emocionante", scale: "R", order: 1 },
  { groupId: 23, text: "tiende a actuar siguiendo sus presentimientos", scale: "E", order: 2 },
  { groupId: 23, text: "tiene un gran vigor y dinamismo", scale: "S", order: 3 },
  // Grupo 24
  { groupId: 24, text: "no confía en los demás hasta que demuestren que son de fiar", scale: "A", order: 0 },
  { groupId: 24, text: "disfruta los problemas que requieren bastante reflexión", scale: "R", order: 1 },
  { groupId: 24, text: "no le gusta trabajar rápidamente", scale: "E", order: 2 },
  { groupId: 24, text: "tiene mucha fe en la gente", scale: "S", order: 3 },
  // Grupo 25
  { groupId: 25, text: "tiende a ceder al deseo del momento", scale: "A", order: 0 },
  { groupId: 25, text: "le agrada resolver problemas complicados", scale: "R", order: 1 },
  { groupId: 25, text: "es un(a) trabajador(a) muy activo(a)", scale: "E", order: 2 },
  { groupId: 25, text: "acepta la crítica con buen ánimo", scale: "S", order: 3 },
  // Grupo 26
  { groupId: 26, text: "le disgustan los problemas que requieren mucho razonamiento", scale: "A", order: 0 },
  { groupId: 26, text: "tiende a actuar primero y pensar después", scale: "R", order: 1 },
  { groupId: 26, text: "no habla sino lo mejor sobre otras personas", scale: "E", order: 2 },
  { groupId: 26, text: "es muy cauteloso(a) antes de actuar", scale: "S", order: 3 },
  // Grupo 27
  { groupId: 27, text: "no le interesan las discusiones que inciten a pensar", scale: "A", order: 0 },
  { groupId: 27, text: "no se apresura yendo de un lugar a otro", scale: "R", order: 1 },
  { groupId: 27, text: "no tiene una mente inquisitiva", scale: "E", order: 2 },
  { groupId: 27, text: "no actúa impulsivamente", scale: "S", order: 3 },
  // Grupo 28
  { groupId: 28, text: "generalmente está desbordante de energía", scale: "A", order: 0 },
  { groupId: 28, text: "se irrita fácilmente por las debilidades de los demás", scale: "R", order: 1 },
  { groupId: 28, text: "puede realizar más cosas que otras personas", scale: "E", order: 2 },
  { groupId: 28, text: "le gusta correr riesgos sólo por la emoción de hacerlo", scale: "S", order: 3 },
  // Grupo 29
  { groupId: 29, text: "se ofende cuando es criticado(a)", scale: "A", order: 0 },
  { groupId: 29, text: "prefiere trabajar con ideas que con cosas", scale: "R", order: 1 },
  { groupId: 29, text: "confía mucho en las personas", scale: "E", order: 2 },
  { groupId: 29, text: "prefiere desempeñar trabajo rutinario y simple", scale: "S", order: 3 },
  // Grupo 30
  { groupId: 30, text: "actúa impulsivamente", scale: "A", order: 0 },
  { groupId: 30, text: "está lleno(a) de vigor y energía", scale: "R", order: 1 },
  { groupId: 30, text: "toma decisiones muy rápidamente", scale: "E", order: 2 },
  { groupId: 30, text: "le simpatiza toda la gente", scale: "S", order: 3 },
  // Grupo 31
  { groupId: 31, text: "mantiene un ritmo vivaz en el trabajo o el juego", scale: "A", order: 0 },
  { groupId: 31, text: "no tiene un gran interés en adquirir conocimientos", scale: "R", order: 1 },
  { groupId: 31, text: "es una persona muy activa", scale: "E", order: 2 },
  { groupId: 31, text: "disfruta las discusiones filosóficas", scale: "S", order: 3 },
  // Grupo 32
  { groupId: 32, text: "le gusta trabajar principalmente con ideas", scale: "A", order: 0 },
  { groupId: 32, text: "se distingue por arriesgarse", scale: "R", order: 1 },
  { groupId: 32, text: "es una persona muy paciente", scale: "E", order: 2 },
  { groupId: 32, text: "se siente cansado(a) y fastidiado(a) al final del día", scale: "S", order: 3 },
  // Grupo 33
  { groupId: 33, text: "no actúa impulsivamente", scale: "A", order: 0 },
  { groupId: 33, text: "tiende a disgustarse mucho con la gente", scale: "R", order: 1 },
  { groupId: 33, text: "es una persona muy cautelosa", scale: "E", order: 2 },
  { groupId: 33, text: "prefiere trabajar despacio", scale: "S", order: 3 },
  // Grupo 34
  { groupId: 34, text: "es muy diplomático(a) y discreto(a)", scale: "A", order: 0 },
  { groupId: 34, text: "prefiere no ocupar su mente en pensamientos profundos", scale: "R", order: 1 },
  { groupId: 34, text: "pierde la paciencia con los demás rápidamente", scale: "E", order: 2 },
  { groupId: 34, text: "tiene menos resistencia que la mayoría de la gente", scale: "S", order: 3 },
  // Grupo 35
  { groupId: 35, text: "tiende a ser creativo(a) y original", scale: "A", order: 0 },
  { groupId: 35, text: "no le interesa mucho lo emocionante", scale: "R", order: 1 },
  { groupId: 35, text: "tiende a actuar siguiendo sus presentimientos", scale: "E", order: 2 },
  { groupId: 35, text: "tiene un gran vigor y dinamismo", scale: "S", order: 3 },
  // Grupo 36
  { groupId: 36, text: "no confía en los demás hasta que demuestren que son de fiar", scale: "A", order: 0 },
  { groupId: 36, text: "disfruta los problemas que requieren bastante reflexión", scale: "R", order: 1 },
  { groupId: 36, text: "no le gusta trabajar rápidamente", scale: "E", order: 2 },
  { groupId: 36, text: "tiene mucha fe en la gente", scale: "S", order: 3 },
  // Grupo 37
  { groupId: 37, text: "tiende a ceder al deseo del momento", scale: "A", order: 0 },
  { groupId: 37, text: "le agrada resolver problemas complicados", scale: "R", order: 1 },
  { groupId: 37, text: "es un(a) trabajador(a) muy activo(a)", scale: "E", order: 2 },
  { groupId: 37, text: "acepta la crítica con buen ánimo", scale: "S", order: 3 },
  // Grupo 38
  { groupId: 38, text: "le disgustan los problemas que requieren mucho razonamiento", scale: "A", order: 0 },
  { groupId: 38, text: "tiende a actuar primero y pensar después", scale: "R", order: 1 },
  { groupId: 38, text: "no habla sino lo mejor sobre otras personas", scale: "E", order: 2 },
  { groupId: 38, text: "es muy cauteloso(a) antes de actuar", scale: "S", order: 3 }
]

async function main() {
  console.log('🌱 Sembrando preguntas del test...')
  
  for (const q of questions) {
    await prisma.testQuestion.upsert({
      where: { id: q.groupId * 10 + q.order }, // ID único aproximado
      update: {},
      create: q
    })
  }
  
  console.log(`✅ ${questions.length} preguntas sembradas correctamente`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })