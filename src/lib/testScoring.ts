// Mapeo de cada afirmación a su escala correspondiente
export const questionToScale: Record<string, string> = {
  // Grupo 1
  "es bastante sociable": "A",
  "le falta confianza en sí mismo(a)": "R",
  "es perfeccionista con cualquier trabajo que realiza": "C",
  "tiende a ser algo emocional": "O",
  // Grupo 2
  "no le interesa estar con otras personas": "A",
  "se siente libre de ansiedades y tensiones": "R",
  "es una persona poco confiable": "C",
  "toma la conducción en las discusiones de grupo": "O",
  // Grupo 3
  "actúa de manera nerviosa e inestable": "A",
  "tiene una gran influencia sobre los demás": "R",
  "no le gustan las reuniones sociales": "E",
  "es un(a) trabajador(a) muy persistente y formal": "S",
  // Grupo 4
  "se le facilita hacer nuevas amistades": "A",
  "no puede realizar la misma tarea por mucho tiempo": "R",
  "es fácilmente manejado(a) por los demás": "E",
  "mantiene el autocontrol aun si está frustrado(a)": "S",
  // Grupo 5
  "es capaz de tomar decisiones importantes sin ayuda": "A",
  "no se relaciona fácilmente con gente desconocida": "R",
  "tiende a sentirse tenso(a) o muy presionado(a)": "E",
  "concluye su trabajo a pesar de los problemas": "S",
  // Grupo 6
  "no le interesa mucho ser sociable": "A",
  "no toma en serio sus responsabilidades": "R",
  "se mantiene estable y sereno(a)": "E",
  "toma el mando en actividades de grupo": "S",
  // Grupo 7
  "es una persona en quien se puede confiar": "A",
  "se disgusta fácilmente cuando las cosas van mal": "R",
  "no se siente muy seguro(a) de sus propias opiniones": "E",
  "prefiere estar cerca de la gente": "S",
  // Grupo 8
  "le resulta fácil influir en los demás": "A",
  "termina su trabajo a pesar de los obstáculos": "R",
  "limita sus relaciones sociales a unos cuantos": "E",
  "tiende a ser una persona más bien nerviosa": "S",
  // Grupo 9
  "no hace amigos fácilmente": "A",
  "toma parte activa en los asuntos de grupo": "R",
  "persiste en tareas rutinarias hasta concluirlas": "E",
  "no se encuentra emocionalmente equilibrado(a)": "S",
  // Grupo 10
  "se siente seguro(a) en sus relaciones con los demás": "A",
  "sus sentimientos son heridos fácilmente": "R",
  "tiene hábitos de trabajo bien desarrollados": "E",
  "prefiere conservar un grupo pequeño de amigos": "S",
  // Grupo 11
  "se irrita con facilidad": "A",
  "es capaz de manejar cualquier situación": "R",
  "no le gusta conversar con extraños": "E",
  "es perfeccionista en el trabajo que realiza": "S",
  // Grupo 12
  "prefiere no discutir con los demás": "A",
  "es incapaz de mantener un horario fijo": "R",
  "es una persona tranquila y serena": "E",
  "tiende a ser muy sociable": "S",
  // Grupo 13
  "se siente libre de inquietudes y preocupaciones": "A",
  "le falta sentido de responsabilidad": "R",
  "no le interesa relacionarse con el sexo opuesto": "E",
  "es hábil para tratar a otras personas": "S",
  // Grupo 14
  "le resulta fácil ser amistoso(a)": "A",
  "prefiere que otros dirijan las actividades de grupo": "R",
  "parece estar siempre preocupado(a)": "E",
  "persevera en un trabajo a pesar de los problemas": "S",
  // Grupo 15
  "es capaz de cambiar las opiniones de otros": "A",
  "no le interesa unirse a actividades grupales": "R",
  "es una persona muy nerviosa": "E",
  "es muy persistente en el trabajo que realiza": "S",
  // Grupo 16
  "es calmado(a) y fácil de tratar": "A",
  "no puede perseverar en el trabajo que realiza": "R",
  "disfruta rodeándose de mucha gente": "E",
  "no confía mucho en sus propias habilidades": "S",
  // Grupo 17
  "es una persona totalmente confiable": "A",
  "no le interesa la compañía de la mayoría de la gente": "R",
  "le resulta difícil relajarse": "E",
  "toma parte activa en las discusiones de grupo": "S",
  // Grupo 18
  "no se deja vencer fácilmente por un problema": "A",
  "tiende a ser algo nervioso(a)": "R",
  "carece de seguridad en sí mismo(a)": "E",
  "prefiere pasar el tiempo en compañía de otros": "S",
  // Grupo 19
  "tiene ideas muy originales": "A",
  "cree que toda la gente es esencialmente honesta": "R",
  "es una persona muy activa": "E",
  "disfruta las discusiones filosóficas": "S",
  // Grupo 20
  "le gusta trabajar principalmente con ideas": "A",
  "se distingue por arriesgarse": "R",
  "es una persona muy paciente": "E",
  "se siente cansado(a) y fastidiado(a) al final del día": "S",
  // Grupo 21
  "no actúa impulsivamente": "A",
  "tiende a disgustarse mucho con la gente": "R",
  "es una persona muy cautelosa": "E",
  "prefiere trabajar despacio": "S",
  // Grupo 22
  "es muy diplomático(a) y discreto(a)": "A",
  "prefiere no ocupar su mente en pensamientos profundos": "R",
  "pierde la paciencia con los demás rápidamente": "E",
  "tiene menos resistencia que la mayoría de la gente": "S",
  // Grupo 23
  "tiende a ser creativo(a) y original": "A",
  "no le interesa mucho lo emocionante": "R",
  "tiende a actuar siguiendo sus presentimientos": "E",
  "tiene un gran vigor y dinamismo": "S",
  // Grupo 24
  "no confía en los demás hasta que demuestren que son de fiar": "A",
  "disfruta los problemas que requieren bastante reflexión": "R",
  "no le gusta trabajar rápidamente": "E",
  "tiene mucha fe en la gente": "S",
  // Grupo 25
  "tiende a ceder al deseo del momento": "A",
  "le agrada resolver problemas complicados": "R",
  "es un(a) trabajador(a) muy activo(a)": "E",
  "acepta la crítica con buen ánimo": "S",
  // Grupo 26
  "le disgustan los problemas que requieren mucho razonamiento": "A",
  "tiende a actuar primero y pensar después": "R",
  "no habla sino lo mejor sobre otras personas": "E",
  "es muy cauteloso(a) antes de actuar": "S",
  // Grupo 27
  "no le interesan las discusiones que inciten a pensar": "A",
  "no se apresura yendo de un lugar a otro": "R",
  "no tiene una mente inquisitiva": "E",
  "no actúa impulsivamente": "S",
  // Grupo 28
  "generalmente está desbordante de energía": "A",
  "se irrita fácilmente por las debilidades de los demás": "R",
  "puede realizar más cosas que otras personas": "E",
  "le gusta correr riesgos sólo por la emoción de hacerlo": "S",
  // Grupo 29
  "se ofende cuando es criticado(a)": "A",
  "prefiere trabajar con ideas que con cosas": "R",
  "confía mucho en las personas": "E",
  "prefiere desempeñar trabajo rutinario y simple": "S",
  // Grupo 30
  "actúa impulsivamente": "A",
  "está lleno(a) de vigor y energía": "R",
  "toma decisiones muy rápidamente": "E",
  "le simpatiza toda la gente": "S",
  // Grupo 31
  "mantiene un ritmo vivaz en el trabajo o el juego": "A",
  "no tiene un gran interés en adquirir conocimientos": "R",
  "es una persona muy activa": "E",
  "disfruta las discusiones filosóficas": "S",
  // Grupo 32
  "le gusta trabajar principalmente con ideas": "A",
  "se distingue por arriesgarse": "R",
  "es una persona muy paciente": "E",
  "se siente cansado(a) y fastidiado(a) al final del día": "S",
  // Grupo 33
  "no actúa impulsivamente": "A",
  "tiende a disgustarse mucho con la gente": "R",
  "es una persona muy cautelosa": "E",
  "prefiere trabajar despacio": "S",
  // Grupo 34
  "es muy diplomático(a) y discreto(a)": "A",
  "prefiere no ocupar su mente en pensamientos profundos": "R",
  "pierde la paciencia con los demás rápidamente": "E",
  "tiene menos resistencia que la mayoría de la gente": "S",
  // Grupo 35
  "tiende a ser creativo(a) y original": "A",
  "no le interesa mucho lo emocionante": "R",
  "tiende a actuar siguiendo sus presentimientos": "E",
  "tiene un gran vigor y dinamismo": "S",
  // Grupo 36
  "no confía en los demás hasta que demuestren que son de fiar": "A",
  "disfruta los problemas que requieren bastante reflexión": "R",
  "no le gusta trabajar rápidamente": "E",
  "tiene mucha fe en la gente": "S",
  // Grupo 37
  "tiende a ceder al deseo del momento": "A",
  "le agrada resolver problemas complicados": "R",
  "es un(a) trabajador(a) muy activo(a)": "E",
  "acepta la crítica con buen ánimo": "S",
  // Grupo 38
  "le disgustan los problemas que requieren mucho razonamiento": "A",
  "tiende a actuar primero y pensar después": "R",
  "no habla sino lo mejor sobre otras personas": "E",
  "es muy cauteloso(a) antes de actuar": "S"
};

export function calculateScores(responses: Array<{ groupId: number; selectedPos: string; selectedNeg: string }>): Record<string, number> {
  // Inicializar todos los puntajes en 0
  const scores = {
    A: 0, R: 0, E: 0, S: 0,
    AE: 0, C: 0, O: 0, P: 0, V: 0
  };
  
  // Contar respuestas "+" y "-" por escala
  const counts: Record<string, { pos: number; neg: number }> = {};
  
  for (const response of responses) {
    const scalePos = questionToScale[response.selectedPos];
    const scaleNeg = questionToScale[response.selectedNeg];
    
    if (scalePos) {
      if (!counts[scalePos]) counts[scalePos] = { pos: 0, neg: 0 };
      counts[scalePos].pos++;
    }
    if (scaleNeg) {
      if (!counts[scaleNeg]) counts[scaleNeg] = { pos: 0, neg: 0 };
      counts[scaleNeg].neg++;
    }
  }
  
  // Calcular puntajes para cada escala (rango 0-28)
  const allScales = ["A", "R", "E", "S", "AE", "C", "O", "P", "V"];
  for (const scale of allScales) {
    const data = counts[scale] || { pos: 0, neg: 0 };
    // Fórmula: puntaje base 14 + (respuestas positivas - respuestas negativas)
    let score = 14 + (data.pos - data.neg);
    score = Math.max(0, Math.min(28, score));
    scores[scale] = score;
  }
  
  console.log("📊 Puntajes calculados:", scores);
  return scores;
}