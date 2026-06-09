// ============================================
// MAPEO EXACTO DE CELDAS DE EXCEL A RESPUESTAS DEL TEST
// Basado en las fórmulas del archivo Excel y el video
// ============================================

// Definición de qué celdas suman para cada escala (extraído de las fórmulas)
const celdasPorEscala: Record<string, string[]> = {
  A: [
    "H7", "I8", "I9", "I10", "K7", "L8", "K9", "K10", "I11", "H12", "I13", "I14",
    "L11", "L12", "L13", "K14", "I15", "H16", "H17", "H18", "L15", "K16", "L17", "L18",
    "I19", "I20", "I21", "H22", "K19", "L20", "L21", "K22", "H23", "I24", "H25", "H26",
    "K23", "L24", "L25", "L26", "H27", "I28", "I29", "I30", "L27", "L28", "L29", "K30",
    "H31", "H32", "H33", "I34", "K31", "K32", "L33", "K34", "I35", "I136", "I37", "H38",
    "K35", "L36", "L37", "L38", "H39", "H40", "I41", "H42", "L39", "K40", "L41", "L42"
  ],
  R: [
    "I7", "I8", "H9", "I10", "L7", "L8", "K9", "L10", "H11", "H12", "H13", "I14",
    "K11", "K12", "L13", "K14", "H15", "I16", "H17", "H18", "L15", "L16", "L17", "K18",
    "H19", "I20", "H21", "H22", "K19", "L20", "K21", "K22", "I23", "I24", "I25", "H26",
    "L23", "L24", "L25", "K26", "I27", "I28", "I29", "H30", "K27", "L28", "K29", "K30",
    "H31", "I32", "H33", "H34", "K31", "L32", "L33", "L34", "H35", "I36", "I37", "I38",
    "L35", "K36", "L37", "L38", "H39", "I40", "I41", "I42", "L39", "L40", "K41", "L42"
  ],
  E: [
    "H7", "I8", "H9", "H10", "K7", "K8", "K9", "L10", "I11", "H12", "H13", "H14",
    "L11", "K12", "L13", "L14", "L15", "K16", "K17", "K18", "I15", "I16", "H17", "I18",
    "H19", "I20", "I21", "I22", "L19", "L20", "L21", "K22", "H23", "H24", "I25", "H26",
    "K23", "K24", "L25", "K26", "H28", "H27", "I29", "H30", "L27", "L28", "K29", "L30",
    "H31", "I32", "I33", "I34", "K31", "L32", "K33", "K34", "H35", "H36", "I37", "H38",
    "K35", "K36", "K37", "L38", "H39", "I40", "H41", "H42", "K39", "K40", "K41", "L42"
  ],
  S: [
    "H7", "H8", "H9", "I10", "K7", "L8", "L9", "L10", "H11", "H12", "I13", "H14",
    "L11", "K12", "K14", "K13", "I15", "I16", "I17", "H18", "K15", "K16", "L17", "K18",
    "H19", "H20", "I21", "H22", "K19", "L20", "L21", "L22", "H23", "I24", "I25", "I26",
    "K23", "L24", "K25", "K26", "H27", "I28", "H29", "H30", "L27", "K28", "K29", "K30",
    "I31", "I32", "H33", "I34", "L31", "L32", "L33", "K34", "H35", "I36", "H37", "H38",
    "K35", "K36", "L37", "K38", "I39", "I40", "I41", "H42", "L39", "K40", "K41", "K42"
  ],
  AE: ["O11", "P11", "Q11", "R11"],
  C: [
    "B7", "C8", "C9", "C10", "F7", "F8", "F9", "E10", "C11", "C12", "C13", "B14",
    "E11", "E12", "E13", "F14", "C15", "B16", "B17", "B18", "E15", "E16", "E17", "F18",
    "B19", "B20", "B21", "C22", "F19", "F20", "E21", "F22", "B23", "B24", "B25", "C26",
    "F23", "F24", "E25", "F26", "C27", "B28", "C29", "C30", "F27", "E28", "E29", "E30",
    "C31", "B32", "C33", "C34", "E31", "F32", "E33", "E34", "B35", "C36", "B37", "B38",
    "E35", "F36", "E37", "E38", "B39", "B40", "C41", "B42", "E39", "F40", "F41", "F42",
    "C43", "B44", "B45", "B46", "F43", "F44", "E45", "F46"
  ],
  O: [
    "B7", "B8", "B9", "C10", "E7", "F8", "F9", "F10", "C11", "C12", "B13", "C14",
    "F11", "F12", "E13", "F14", "C15", "C16", "C17", "B18", "E15", "E16", "F17", "E18",
    "C19", "C20", "C21", "B22", "E19", "F20", "F21", "F22", "B23", "B24", "C25", "B26",
    "E23", "F24", "F25", "F26", "B27", "B28", "C29", "B30", "F27", "F28", "F29", "E30",
    "C31", "B32", "B33", "B34", "E31", "E32", "E33", "F34", "C35", "C36", "C37", "B38",
    "F35", "F36", "F37", "E38", "B39", "C40", "B41", "B42", "E39", "E40", "F41", "E42",
    "B43", "B44", "B45", "C46", "E43", "E44", "E45", "F46"
  ],
  P: [
    "C7", "C8", "B9", "C10", "E7", "E8", "F9", "E10", "C11", "B12", "B13", "B14",
    "E11", "F12", "F13", "F14", "B15", "B16", "C16", "C17", "B18", "F15", "E16", "F17",
    "F18", "C19", "B20", "C21", "C22", "E19", "E20", "E21", "F22", "C23", "B24", "C25",
    "C26", "E23", "E24", "E25", "F26", "B27", "C28", "C29", "C30", "E27", "F28", "E29",
    "E30", "B31", "B32", "B33", "C34", "E31", "F32", "F33", "F34", "B35", "B36", "C37",
    "B38", "F35", "F36", "E37", "F38", "B39", "C40", "C41", "C42", "E39", "F40", "E41",
    "E42", "C43", "B44", "C45", "C46", "F43", "E44", "E45", "E46"
  ],
  V: [
    "B7", "C8", "B9", "B10", "E7", "F8", "E9", "E10", "B11", "C12", "B13", "B14",
    "E11", "F12", "E13", "E14", "C15", "B16", "C17", "C18", "E15", "F16", "F17", "F18",
    "C19", "B20", "B21", "B22", "E19", "F20", "E21", "E22", "B23", "C24", "C25", "C26",
    "E23", "F24", "E25", "E26", "B27", "B28", "B29", "C30", "F27", "F28", "E29", "F30",
    "C31", "C32", "B33", "C34", "F31", "F32", "E33", "F34", "B35", "C36", "C37", "C38",
    "F35", "E36", "E37", "E38", "C39", "C40", "C41", "B42", "F39", "F40", "F41", "E42",
    "C43", "C44", "B45", "C46", "F43", "E44", "F45", "F46"
  ]
};

// ============================================
// MAPEO DE RESPUESTAS A CELDAS DE EXCEL
// ============================================

interface RespuestaInfo {
  groupId: number;
  afirmacionIndex: number;
  esMasParecido: boolean;
  celda: string;
}

const respuestasMapeo: RespuestaInfo[] = [];

function registrarRespuesta(groupId: number, afirmacionIndex: number, esMasParecido: boolean, celda: string) {
  respuestasMapeo.push({ groupId, afirmacionIndex, esMasParecido, celda });
}

// ============================================
// PARTE 4 - Grupos 28-37 (IPG - Vigor)
// ============================================

// Grupo 28
registrarRespuesta(28, 0, true, "H7");
registrarRespuesta(28, 1, true, "I8");
registrarRespuesta(28, 2, true, "I9");
registrarRespuesta(28, 3, true, "I10");

// Grupo 29
registrarRespuesta(29, 0, true, "K7");
registrarRespuesta(29, 1, true, "L8");
registrarRespuesta(29, 2, true, "K9");
registrarRespuesta(29, 3, true, "K10");

// Grupo 30
registrarRespuesta(30, 0, true, "I11");
registrarRespuesta(30, 1, true, "H12");
registrarRespuesta(30, 2, true, "I13");
registrarRespuesta(30, 3, true, "I14");

// Grupo 31
registrarRespuesta(31, 0, true, "L11");
registrarRespuesta(31, 1, true, "L12");
registrarRespuesta(31, 2, true, "L13");
registrarRespuesta(31, 3, true, "K14");

// Grupo 32
registrarRespuesta(32, 0, true, "I15");
registrarRespuesta(32, 1, true, "H16");
registrarRespuesta(32, 2, true, "H17");
registrarRespuesta(32, 3, true, "H18");

// Grupo 33
registrarRespuesta(33, 0, true, "L15");
registrarRespuesta(33, 1, true, "K16");
registrarRespuesta(33, 2, true, "L17");
registrarRespuesta(33, 3, true, "L18");

// Grupo 34
registrarRespuesta(34, 0, true, "I19");
registrarRespuesta(34, 1, true, "I20");
registrarRespuesta(34, 2, true, "I21");
registrarRespuesta(34, 3, true, "H22");

// Grupo 35
registrarRespuesta(35, 0, true, "K19");
registrarRespuesta(35, 1, true, "L20");
registrarRespuesta(35, 2, true, "L21");
registrarRespuesta(35, 3, true, "K22");

// Grupo 36
registrarRespuesta(36, 0, true, "H23");
registrarRespuesta(36, 1, true, "I24");
registrarRespuesta(36, 2, true, "H25");
registrarRespuesta(36, 3, true, "H26");

// Grupo 37
registrarRespuesta(37, 0, true, "K23");
registrarRespuesta(37, 1, true, "L24");
registrarRespuesta(37, 2, true, "L25");
registrarRespuesta(37, 3, true, "L26");

// ============================================
// PARTE 3 - Grupos 18-27 (IPG - Vigor)
// ============================================

// Grupo 18
registrarRespuesta(18, 0, true, "H27");
registrarRespuesta(18, 1, true, "I28");
registrarRespuesta(18, 2, true, "I29");
registrarRespuesta(18, 3, true, "I30");

// Grupo 19
registrarRespuesta(19, 0, true, "L27");
registrarRespuesta(19, 1, true, "L28");
registrarRespuesta(19, 2, true, "L29");
registrarRespuesta(19, 3, true, "K30");

// Grupo 20
registrarRespuesta(20, 0, true, "H31");
registrarRespuesta(20, 1, true, "H32");
registrarRespuesta(20, 2, true, "H33");
registrarRespuesta(20, 3, true, "I34");

// Grupo 21
registrarRespuesta(21, 0, true, "K31");
registrarRespuesta(21, 1, true, "K32");
registrarRespuesta(21, 2, true, "L33");
registrarRespuesta(21, 3, true, "K34");

// Grupo 22
registrarRespuesta(22, 0, true, "I35");
registrarRespuesta(22, 1, true, "I136");
registrarRespuesta(22, 2, true, "I37");
registrarRespuesta(22, 3, true, "H38");

// Grupo 23
registrarRespuesta(23, 0, true, "K35");
registrarRespuesta(23, 1, true, "L36");
registrarRespuesta(23, 2, true, "L37");
registrarRespuesta(23, 3, true, "L38");

// Grupo 24
registrarRespuesta(24, 0, true, "H39");
registrarRespuesta(24, 1, true, "H40");
registrarRespuesta(24, 2, true, "I41");
registrarRespuesta(24, 3, true, "H42");

// Grupo 25
registrarRespuesta(25, 0, true, "L39");
registrarRespuesta(25, 1, true, "K40");
registrarRespuesta(25, 2, true, "L41");
registrarRespuesta(25, 3, true, "L42");

// ============================================
// PARTE 2 - Grupos 9-17 (PPG - AE, C, O, P)
// ============================================

// Grupo 9
registrarRespuesta(9, 0, true, "B7");
registrarRespuesta(9, 1, true, "C8");
registrarRespuesta(9, 2, true, "C9");
registrarRespuesta(9, 3, true, "C10");

// Grupo 10
registrarRespuesta(10, 0, true, "F7");
registrarRespuesta(10, 1, true, "F8");
registrarRespuesta(10, 2, true, "F9");
registrarRespuesta(10, 3, true, "E10");

// Grupo 11
registrarRespuesta(11, 0, true, "C11");
registrarRespuesta(11, 1, true, "C12");
registrarRespuesta(11, 2, true, "C13");
registrarRespuesta(11, 3, true, "B14");

// Grupo 12
registrarRespuesta(12, 0, true, "E11");
registrarRespuesta(12, 1, true, "E12");
registrarRespuesta(12, 2, true, "E13");
registrarRespuesta(12, 3, true, "F14");

// Grupo 13
registrarRespuesta(13, 0, true, "C15");
registrarRespuesta(13, 1, true, "B16");
registrarRespuesta(13, 2, true, "B17");
registrarRespuesta(13, 3, true, "B18");

// Grupo 14
registrarRespuesta(14, 0, true, "E15");
registrarRespuesta(14, 1, true, "E16");
registrarRespuesta(14, 2, true, "E17");
registrarRespuesta(14, 3, true, "F18");

// Grupo 15
registrarRespuesta(15, 0, true, "B19");
registrarRespuesta(15, 1, true, "B20");
registrarRespuesta(15, 2, true, "B21");
registrarRespuesta(15, 3, true, "C22");

// Grupo 16
registrarRespuesta(16, 0, true, "F19");
registrarRespuesta(16, 1, true, "F20");
registrarRespuesta(16, 2, true, "E21");
registrarRespuesta(16, 3, true, "F22");

// Grupo 17
registrarRespuesta(17, 0, true, "B23");
registrarRespuesta(17, 1, true, "B24");
registrarRespuesta(17, 2, true, "B25");
registrarRespuesta(17, 3, true, "C26");

// ============================================
// PARTE 1 - Grupos 0-8 (PPG - A, R, E, S)
// Autoestima (AE)
// ============================================

// Grupo 0
registrarRespuesta(0, 0, true, "O11");
registrarRespuesta(0, 1, true, "P11");
registrarRespuesta(0, 2, true, "Q11");
registrarRespuesta(0, 3, true, "R11");

// Grupo 1
registrarRespuesta(1, 0, true, "F23");
registrarRespuesta(1, 1, true, "F24");
registrarRespuesta(1, 2, true, "E25");
registrarRespuesta(1, 3, true, "F26");

// Grupo 2
registrarRespuesta(2, 0, true, "C27");
registrarRespuesta(2, 1, true, "B28");
registrarRespuesta(2, 2, true, "C29");
registrarRespuesta(2, 3, true, "C30");

// Grupo 3
registrarRespuesta(3, 0, true, "F27");
registrarRespuesta(3, 1, true, "E28");
registrarRespuesta(3, 2, true, "E29");
registrarRespuesta(3, 3, true, "E30");

// Grupo 4
registrarRespuesta(4, 0, true, "C31");
registrarRespuesta(4, 1, true, "B32");
registrarRespuesta(4, 2, true, "C33");
registrarRespuesta(4, 3, true, "C34");

// Grupo 5
registrarRespuesta(5, 0, true, "E31");
registrarRespuesta(5, 1, true, "F32");
registrarRespuesta(5, 2, true, "E33");
registrarRespuesta(5, 3, true, "E34");

// Grupo 6
registrarRespuesta(6, 0, true, "B35");
registrarRespuesta(6, 1, true, "C36");
registrarRespuesta(6, 2, true, "B37");
registrarRespuesta(6, 3, true, "B38");

// Grupo 7
registrarRespuesta(7, 0, true, "E35");
registrarRespuesta(7, 1, true, "F36");
registrarRespuesta(7, 2, true, "E37");
registrarRespuesta(7, 3, true, "E38");

// Grupo 8
registrarRespuesta(8, 0, true, "B39");
registrarRespuesta(8, 1, true, "B40");
registrarRespuesta(8, 2, true, "C41");
registrarRespuesta(8, 3, true, "B42");

// ============================================
// REGISTRO DE RESPUESTAS "MENOS PARECIDO" (COLUMNAS -)
// ============================================

// PARTE 4 - Menos parecido
registrarRespuesta(28, 0, false, "H7");
registrarRespuesta(28, 1, false, "I8");
registrarRespuesta(28, 2, false, "I9");
registrarRespuesta(28, 3, false, "I10");
registrarRespuesta(29, 0, false, "K7");
registrarRespuesta(29, 1, false, "L8");
registrarRespuesta(29, 2, false, "K9");
registrarRespuesta(29, 3, false, "K10");
// Continuar con los grupos restantes...

// ============================================
// FUNCIÓN PARA OBTENER LA CELDA DE UNA RESPUESTA
// ============================================

export function obtenerCeldaPorRespuesta(groupId: number, afirmacionIndex: number, esMasParecido: boolean): string | null {
  const encontrada = respuestasMapeo.find(
    r => r.groupId === groupId && r.afirmacionIndex === afirmacionIndex && r.esMasParecido === esMasParecido
  );
  return encontrada ? encontrada.celda : null;
}

// ============================================
// INTERFAZ Y FUNCIÓN PRINCIPAL DE CÁLCULO
// ============================================

export interface RespuestaUsuario {
  groupId: number;
  afirmacionIndex: number;
  esMasParecido: boolean;
}

export function calcularPuntajesExcel(respuestas: RespuestaUsuario[]): Record<string, number> {
  const scores = {
    A: 0, R: 0, E: 0, S: 0, AE: 0, C: 0, O: 0, P: 0, V: 0
  };

  // Contar cuántas veces aparece cada celda
  const celdasMarcadas: Record<string, number> = {};
  
  respuestas.forEach(resp => {
    const celda = obtenerCeldaPorRespuesta(resp.groupId, resp.afirmacionIndex, resp.esMasParecido);
    if (celda) {
      celdasMarcadas[celda] = (celdasMarcadas[celda] || 0) + 1;
    }
  });

  // Sumar según las fórmulas del Excel
  for (const [escala, celdas] of Object.entries(celdasPorEscala)) {
    let total = 0;
    for (const celda of celdas) {
      if (celdasMarcadas[celda]) {
        total += celdasMarcadas[celda];
      }
    }
    scores[escala as keyof typeof scores] = total;
  }

  return scores;
}