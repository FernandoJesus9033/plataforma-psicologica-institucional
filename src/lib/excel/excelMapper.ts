import { RespuestaUsuario } from "./types";

// ============================================
// MAPEO DE RESPUESTAS A CELDAS EN EXCEL
// Basado en el archivo "Test Gordon P-IPG (automatizado) juan manuel.xlsx"
// ============================================

const mapeoRespuestaACelda: Map<string, string> = new Map();

function registrarCelda(groupId: number, afirmacionIndex: number, esMasParecido: boolean, celda: string) {
  const key = `${groupId}_${afirmacionIndex}_${esMasParecido ? "mas" : "menos"}`;
  mapeoRespuestaACelda.set(key, celda);
}

// ============================================
// PARTE 4 - IPG (Vigor) - Columnas H (+) e I (-)
// Grupos 28-37
// ============================================

// Grupo 28
registrarCelda(28, 0, true, "H7");
registrarCelda(28, 1, true, "I8");
registrarCelda(28, 2, true, "I9");
registrarCelda(28, 3, true, "I10");
registrarCelda(28, 0, false, "H7");
registrarCelda(28, 1, false, "I8");
registrarCelda(28, 2, false, "I9");
registrarCelda(28, 3, false, "I10");

// Grupo 29
registrarCelda(29, 0, true, "K7");
registrarCelda(29, 1, true, "L8");
registrarCelda(29, 2, true, "K9");
registrarCelda(29, 3, true, "K10");
registrarCelda(29, 0, false, "K7");
registrarCelda(29, 1, false, "L8");
registrarCelda(29, 2, false, "K9");
registrarCelda(29, 3, false, "K10");

// Grupo 30
registrarCelda(30, 0, true, "I11");
registrarCelda(30, 1, true, "H12");
registrarCelda(30, 2, true, "I13");
registrarCelda(30, 3, true, "I14");
registrarCelda(30, 0, false, "I11");
registrarCelda(30, 1, false, "H12");
registrarCelda(30, 2, false, "I13");
registrarCelda(30, 3, false, "I14");

// Grupo 31
registrarCelda(31, 0, true, "L11");
registrarCelda(31, 1, true, "L12");
registrarCelda(31, 2, true, "L13");
registrarCelda(31, 3, true, "K14");
registrarCelda(31, 0, false, "L11");
registrarCelda(31, 1, false, "L12");
registrarCelda(31, 2, false, "L13");
registrarCelda(31, 3, false, "K14");

// Grupo 32
registrarCelda(32, 0, true, "I15");
registrarCelda(32, 1, true, "H16");
registrarCelda(32, 2, true, "H17");
registrarCelda(32, 3, true, "H18");
registrarCelda(32, 0, false, "I15");
registrarCelda(32, 1, false, "H16");
registrarCelda(32, 2, false, "H17");
registrarCelda(32, 3, false, "H18");

// Grupo 33
registrarCelda(33, 0, true, "L15");
registrarCelda(33, 1, true, "K16");
registrarCelda(33, 2, true, "L17");
registrarCelda(33, 3, true, "L18");
registrarCelda(33, 0, false, "L15");
registrarCelda(33, 1, false, "K16");
registrarCelda(33, 2, false, "L17");
registrarCelda(33, 3, false, "L18");

// Grupo 34
registrarCelda(34, 0, true, "I19");
registrarCelda(34, 1, true, "I20");
registrarCelda(34, 2, true, "I21");
registrarCelda(34, 3, true, "H22");
registrarCelda(34, 0, false, "I19");
registrarCelda(34, 1, false, "I20");
registrarCelda(34, 2, false, "I21");
registrarCelda(34, 3, false, "H22");

// Grupo 35
registrarCelda(35, 0, true, "K19");
registrarCelda(35, 1, true, "L20");
registrarCelda(35, 2, true, "L21");
registrarCelda(35, 3, true, "K22");
registrarCelda(35, 0, false, "K19");
registrarCelda(35, 1, false, "L20");
registrarCelda(35, 2, false, "L21");
registrarCelda(35, 3, false, "K22");

// Grupo 36
registrarCelda(36, 0, true, "H23");
registrarCelda(36, 1, true, "I24");
registrarCelda(36, 2, true, "H25");
registrarCelda(36, 3, true, "H26");
registrarCelda(36, 0, false, "H23");
registrarCelda(36, 1, false, "I24");
registrarCelda(36, 2, false, "H25");
registrarCelda(36, 3, false, "H26");

// Grupo 37
registrarCelda(37, 0, true, "K23");
registrarCelda(37, 1, true, "L24");
registrarCelda(37, 2, true, "L25");
registrarCelda(37, 3, true, "L26");
registrarCelda(37, 0, false, "K23");
registrarCelda(37, 1, false, "L24");
registrarCelda(37, 2, false, "L25");
registrarCelda(37, 3, false, "L26");

// ============================================
// PARTE 3 - IPG (Vigor) - Grupos 18-27
// ============================================

// Grupo 18
registrarCelda(18, 0, true, "H27");
registrarCelda(18, 1, true, "I28");
registrarCelda(18, 2, true, "I29");
registrarCelda(18, 3, true, "I30");
registrarCelda(18, 0, false, "H27");
registrarCelda(18, 1, false, "I28");
registrarCelda(18, 2, false, "I29");
registrarCelda(18, 3, false, "I30");

// Grupo 19
registrarCelda(19, 0, true, "L27");
registrarCelda(19, 1, true, "L28");
registrarCelda(19, 2, true, "L29");
registrarCelda(19, 3, true, "K30");
registrarCelda(19, 0, false, "L27");
registrarCelda(19, 1, false, "L28");
registrarCelda(19, 2, false, "L29");
registrarCelda(19, 3, false, "K30");

// Grupo 20
registrarCelda(20, 0, true, "H31");
registrarCelda(20, 1, true, "H32");
registrarCelda(20, 2, true, "H33");
registrarCelda(20, 3, true, "I34");
registrarCelda(20, 0, false, "H31");
registrarCelda(20, 1, false, "H32");
registrarCelda(20, 2, false, "H33");
registrarCelda(20, 3, false, "I34");

// Grupo 21
registrarCelda(21, 0, true, "K31");
registrarCelda(21, 1, true, "K32");
registrarCelda(21, 2, true, "L33");
registrarCelda(21, 3, true, "K34");
registrarCelda(21, 0, false, "K31");
registrarCelda(21, 1, false, "K32");
registrarCelda(21, 2, false, "L33");
registrarCelda(21, 3, false, "K34");

// Grupo 22
registrarCelda(22, 0, true, "I35");
registrarCelda(22, 1, true, "I136");
registrarCelda(22, 2, true, "I37");
registrarCelda(22, 3, true, "H38");
registrarCelda(22, 0, false, "I35");
registrarCelda(22, 1, false, "I136");
registrarCelda(22, 2, false, "I37");
registrarCelda(22, 3, false, "H38");

// Grupo 23
registrarCelda(23, 0, true, "K35");
registrarCelda(23, 1, true, "L36");
registrarCelda(23, 2, true, "L37");
registrarCelda(23, 3, true, "L38");
registrarCelda(23, 0, false, "K35");
registrarCelda(23, 1, false, "L36");
registrarCelda(23, 2, false, "L37");
registrarCelda(23, 3, false, "L38");

// Grupo 24
registrarCelda(24, 0, true, "H39");
registrarCelda(24, 1, true, "H40");
registrarCelda(24, 2, true, "I41");
registrarCelda(24, 3, true, "H42");
registrarCelda(24, 0, false, "H39");
registrarCelda(24, 1, false, "H40");
registrarCelda(24, 2, false, "I41");
registrarCelda(24, 3, false, "H42");

// Grupo 25
registrarCelda(25, 0, true, "L39");
registrarCelda(25, 1, true, "K40");
registrarCelda(25, 2, true, "L41");
registrarCelda(25, 3, true, "L42");
registrarCelda(25, 0, false, "L39");
registrarCelda(25, 1, false, "K40");
registrarCelda(25, 2, false, "L41");
registrarCelda(25, 3, false, "L42");

// ============================================
// CELDAS DE RESULTADOS (según tu Excel)
// ============================================
export const CELDAS_RESULTADOS = {
  pd: {
    ascendencia: "O12",
    responsabilidad: "P12",
    estabilidadEmocional: "Q12",
    sociabilizacion: "R12",
    autoestima: "S12",
    cautela: "T12",
    originalidad: "U12",
    relacionesInterpersonales: "V12",
    vigor: "W12",
  },
  pc: {
    ascendencia: "O13",
    responsabilidad: "P13",
    estabilidadEmocional: "Q13",
    sociabilizacion: "R13",
    autoestima: "S13",
    cautela: "T13",
    originalidad: "U13",
    relacionesInterpersonales: "V13",
    vigor: "W13",
  }
};

export function obtenerCelda(respuesta: RespuestaUsuario): string | undefined {
  const key = `${respuesta.groupId}_${respuesta.afirmacionIndex}_${respuesta.esMasParecido ? "mas" : "menos"}`;
  return mapeoRespuestaACelda.get(key);
}