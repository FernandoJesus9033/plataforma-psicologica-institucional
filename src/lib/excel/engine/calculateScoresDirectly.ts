// ============================================
// CÁLCULO DE PUNTAJES BRUTOS (PD) DIRECTAMENTE DESDE RESPUESTAS
// ============================================

interface Respuesta {
  groupId: number;
  masParecido: number;
  menosParecido: number;
}

export function calculateScoresDirectly(respuestas: Respuesta[]) {
  // Inicializar puntajes en 0
  const scores = {
    A: 0,  // Ascendencia
    R: 0,  // Responsabilidad
    E: 0,  // Estabilidad Emocional
    S: 0,  // Sociabilidad
    AE: 0, // Autoestima
    C: 0,  // Cautela
    O: 0,  // Originalidad
    P: 0,  // Relaciones Interpersonales
    V: 0   // Vigor
  };

  // ==========================================
  // MAPEO DE GRUPOS A ESCALAS
  // Basado en el manual Gordon P-IPG
  // ==========================================

  respuestas.forEach((respuesta) => {
    const groupId = respuesta.groupId;
    
    // ==========================================
    // PARTE 1 - Grupos 0-8: A, R, E, S
    // ==========================================
    if (groupId >= 0 && groupId <= 8) {
      if (groupId === 0 || groupId === 4) {
        scores.A += 1;
        console.log(`  Grupo ${groupId} → A +1 (total A = ${scores.A})`);
      }
      else if (groupId === 1 || groupId === 5) {
        scores.R += 1;
        console.log(`  Grupo ${groupId} → R +1 (total R = ${scores.R})`);
      }
      else if (groupId === 2 || groupId === 6) {
        scores.E += 1;
        console.log(`  Grupo ${groupId} → E +1 (total E = ${scores.E})`);
      }
      else if (groupId === 3 || groupId === 7 || groupId === 8) {
        scores.S += 1;
        console.log(`  Grupo ${groupId} → S +1 (total S = ${scores.S})`);
      }
    } 
    // ==========================================
    // PARTE 2 - Grupos 9-17: AE, C, O, P
    // ==========================================
    else if (groupId >= 9 && groupId <= 17) {
      if (groupId === 9 || groupId === 13) {
        scores.AE += 1;
        console.log(`  Grupo ${groupId} → AE +1 (total AE = ${scores.AE})`);
      }
      else if (groupId === 10 || groupId === 14) {
        scores.C += 1;
        console.log(`  Grupo ${groupId} → C +1 (total C = ${scores.C})`);
      }
      else if (groupId === 11 || groupId === 15) {
        scores.O += 1;
        console.log(`  Grupo ${groupId} → O +1 (total O = ${scores.O})`);
      }
      else if (groupId === 12 || groupId === 16 || groupId === 17) {
        scores.P += 1;
        console.log(`  Grupo ${groupId} → P +1 (total P = ${scores.P})`);
      }
    }
    // ==========================================
    // PARTE 3 y 4 - Grupos 18-37: V (Vigor)
    // ==========================================
    else {
      scores.V += 1;
      console.log(`  Grupo ${groupId} → V +1 (total V = ${scores.V})`);
    }
  });

  return scores;
}