export interface RespuestaUsuario {
  groupId: number;
  afirmacionIndex: number;
  esMasParecido: boolean;
}

export interface ResultadoExcel {
  nombre: string;
  fecha: string;
  ppg: {
    ascendencia: number;
    responsabilidad: number;
    estabilidad_emocional: number;
    sociabilizacion: number;
  };
  ipg: {
    autoestima: number;
    cautela: number;
    originalidad: number;
    relaciones_interpersonales: number;
    vigor: number;
  };
  percentiles: {
    pd: number[];
    pc: number[];
  };
}