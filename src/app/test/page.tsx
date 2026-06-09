"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModalInstrucciones from "@/components/ModalInstrucciones";
import ModalMensaje from "@/components/ModalMensaje";
import { FaArrowLeft, FaSave, FaHeart, FaBrain } from "react-icons/fa";

// ============================================
// 38 GRUPOS DE PREGUNTAS (ids correctamente ordenados del 0 al 37)
// ============================================
const testGroups = [
  // Grupo 0 - PARTE 1
  {
    id: 0,
    statements: [
      "es bastante sociable",
      "le falta confianza en sí mismo(a)",
      "es perfeccionista con cualquier trabajo que realiza",
      "tiende a ser algo emocional"
    ]
  },
  // Grupo 1 - PARTE 1
  {
    id: 1,
    statements: [
      "no le interesa estar con otras personas",
      "se siente libre de ansiedades y tensiones",
      "es una persona poco confiable",
      "toma la conducción de discusiones de grupo"
    ]
  },
  // Grupo 2 - PARTE 1
  {
    id: 2,
    statements: [
      "actúa de manera nerviosa e inestable",
      "tiene una gran influencia sobre los demás",
      "no le gustan las reuniones sociales",
      "es un(a) trabajador(a) muy persistente y formal"
    ]
  },
  // Grupo 3 - PARTE 1
  {
    id: 3,
    statements: [
      "se le facilita hacer nuevas amistades",
      "no puede realizar la misma tarea por mucho tiempo",
      "es fácilmente manejado(a) por los demás",
      "mantiene el autocontrol aún si está frustrado(a)"
    ]
  },
  // Grupo 4 - PARTE 1
  {
    id: 4,
    statements: [
      "es capaz de tomar decisiones importantes sin su ayuda",
      "no se relaciona fácilmente con gente desconocida",
      "tiende a sentirse tenso(a) o muy presionado(a)",
      "concluye su trabajo a pesar de los problemas"
    ]
  },
  // Grupo 5 - PARTE 1
  {
    id: 5,
    statements: [
      "no le interesa mucho ser sociable",
      "no toma en serio sus responsabilidades",
      "se mantiene estable y sereno(a)",
      "toma el mando en actividades de grupo"
    ]
  },
  // Grupo 6 - PARTE 1
  {
    id: 6,
    statements: [
      "es una persona en quien se puede confiar",
      "se disgusta fácilmente cuando las cosas van mal",
      "no se siente muy seguro(a) de sus propias opiniones",
      "prefiere estar cerca de la gente"
    ]
  },
  // Grupo 7 - PARTE 1
  {
    id: 7,
    statements: [
      "le resulta fácil influir en los demás",
      "termina sus trabajos a pesar de los obstáculos",
      "limita sus relaciones sociales a unos cuantos",
      "tiende a ser una persona más bien nerviosa"
    ]
  },
  // Grupo 8 - PARTE 1
  {
    id: 8,
    statements: [
      "no hace amigos fácilmente",
      "toma parte activa en los asuntos de grupo",
      "persiste en tareas rutinarias hasta concluirlas",
      "no se encuentra emocionalmente equilibrado(a)"
    ]
  },
  // Grupo 9 - PARTE 2
  {
    id: 9,
    statements: [
      "se siente seguro(a) en sus relaciones con los demás",
      "sus sentimientos son heridos fácilmente",
      "tiene hábitos de trabajo bien desarrollados",
      "prefiere conservar un grupo pequeño de amigos"
    ]
  },
  // Grupo 10 - PARTE 2
  {
    id: 10,
    statements: [
      "se irrita con facilidad",
      "es capaz de manejar cualquier situación",
      "no le gusta conversar con extraños",
      "es perfeccionista en el trabajo que realiza"
    ]
  },
  // Grupo 11 - PARTE 2
  {
    id: 11,
    statements: [
      "prefiere no discutir con los demás",
      "es incapaz de mantener un horario fijo",
      "es una persona tranquila y serena",
      "tiende a ser muy sociable"
    ]
  },
  // Grupo 12 - PARTE 2
  {
    id: 12,
    statements: [
      "se siente libre de inquietudes y preocupaciones",
      "le falta sentido de responsabilidad",
      "no le interesa relacionarse con el sexo opuesto",
      "es hábil para tratar a otras personas"
    ]
  },
  // Grupo 13 - PARTE 2
  {
    id: 13,
    statements: [
      "le resulta fácil ser amistoso(a)",
      "prefiere que otros dirijan las actividades de grupo",
      "parece estar siempre preocupado(a)",
      "persevera en un trabajo a pesar de los problemas"
    ]
  },
  // Grupo 14 - PARTE 2
  {
    id: 14,
    statements: [
      "es capaz de cambiar las opiniones de otros",
      "no le interesa unirse a actividades grupales",
      "es una persona muy nerviosa",
      "es muy persistente en el trabajo que realiza"
    ]
  },
  // Grupo 15 - PARTE 2
  {
    id: 15,
    statements: [
      "es calmado(a) y fácil de tratar",
      "no puede perseverar en el trabajo que realiza",
      "disfruta rodeándose de mucha gente",
      "no confía mucho en sus propias habilidades"
    ]
  },
  // Grupo 16 - PARTE 2
  {
    id: 16,
    statements: [
      "es una persona totalmente confiable",
      "no le interesa la compañía de la mayoría de la gente",
      "le resulta difícil relajarse",
      "toma parte activa en las discusiones de grupo"
    ]
  },
  // Grupo 17 - PARTE 2
  {
    id: 17,
    statements: [
      "no se deja vencer fácilmente",
      "tiende a ser algo nervioso(a)",
      "carece de seguridad en sí mismo(a)",
      "prefiere pasar el tiempo en compañía de otros"
    ]
  },
  // Grupo 18 - PARTE 3
  {
    id: 18,
    statements: [
      "tiene ideas muy originales",
      "es una persona un poco lenta y despreocupada",
      "tiende a criticar a los demás",
      "piensa mucho antes de tomar decisiones"
    ]
  },
  // Grupo 19 - PARTE 3
  {
    id: 19,
    statements: [
      "cree que toda la gente es esencialmente honesta",
      "le gusta tomar con calma el trabajo o el juego",
      "tiene una actitud muy inquisitiva",
      "tiende a actuar impulsivamente"
    ]
  },
  // Grupo 20 - PARTE 3
  {
    id: 20,
    statements: [
      "es una persona muy activa",
      "no se enoja con los demás",
      "le disgusta trabajar con problemas complejos y difíciles",
      "prefiere fiestas animadas a reuniones tranquilas"
    ]
  },
  // Grupo 21 - PARTE 3
  {
    id: 21,
    statements: [
      "disfruta las discusiones filosóficas",
      "se cansa fácilmente",
      "piensa las cosas con mucho cuidado antes de actuar",
      "no confía mucho en la gente"
    ]
  },
  // Grupo 22 - PARTE 3
  {
    id: 22,
    statements: [
      "le gusta trabajar principalmente con ideas",
      "sigue un ritmo lento al realizar sus acciones",
      "es muy cuidadoso(a) al tomar una decisión",
      "le es difícil llevarse bien con algunas personas"
    ]
  },
  // Grupo 23 - PARTE 3
  {
    id: 23,
    statements: [
      "se distingue por arriesgarse",
      "se irrita fácilmente con los demás",
      "puede hacer poco en mucho tiempo",
      "emplea bastante tiempo pensando en nuevas ideas"
    ]
  },
  // Grupo 24 - PARTE 3
  {
    id: 24,
    statements: [
      "es una persona muy paciente",
      "busca lo emocionante y excitante",
      "es capaz de trabajar durante largos lapsos",
      "prefiere poner en práctica un proyecto que planearlo"
    ]
  },
  // Grupo 25 - PARTE 3
  {
    id: 25,
    statements: [
      "se siente cansado(a) y fastidiado(a) al final de un día",
      "tiende a hacer juicios apresurados",
      "no muestra resentimiento hacia los demás",
      "tiene una gran sed de conocimientos"
    ]
  },
  // Grupo 26 - PARTE 3
  {
    id: 26,
    statements: [
      "no actúa impulsivamente",
      "se irrita con los errores de los demás",
      "carece de interés para pensar de manera crítica",
      "prefiere trabajar rápidamente"
    ]
  },
  // Grupo 27 - PARTE 3
  {
    id: 27,
    statements: [
      "tiende a disgustarse mucho con la gente",
      "le gusta estar siempre activo(a)",
      "preferiría no correr riesgos",
      "prefiere el trabajo que requiere pocas ideas originales"
    ]
  },
  // Grupo 28 - PARTE 4
  {
    id: 28,
    statements: [
      "es una persona muy cautelosa",
      "prefiere trabajar despacio",
      "es muy diplomático(a) y discreto(a)",
      "prefiere no ocupar su mente en pensamientos profundos"
    ]
  },
  // Grupo 29 - PARTE 4
  {
    id: 29,
    statements: [
      "pierde la paciencia con los demás rápidamente",
      "tiene menos resistencia que la mayoría de la gente",
      "tiende a ser creativo(a) y original",
      "no le interesa mucho lo emocionante"
    ]
  },
  // Grupo 30 - PARTE 4
  {
    id: 30,
    statements: [
      "tiende a actuar siguiendo sus presentimientos",
      "tiene un gran vigor y dinamismo",
      "no confía en los demás hasta que demuestren que son de fiar",
      "disfruta los problemas que requieren de bastante reflexión"
    ]
  },
  // Grupo 31 - PARTE 4
  {
    id: 31,
    statements: [
      "no le gusta trabajar rápidamente",
      "tiene mucha fe en la gente",
      "tiende a ceder al deseo del momento",
      "le agrada resolver problemas complicados"
    ]
  },
  // Grupo 32 - PARTE 4
  {
    id: 32,
    statements: [
      "es un(a) trabajador(a) muy activo(a)",
      "acepta la crítica con buen ánimo",
      "le disgustan los problemas que requieren mucho razonamiento",
      "tiende a actuar primero y pensar después"
    ]
  },
  // Grupo 33 - PARTE 4
  {
    id: 33,
    statements: [
      "no habla sino lo mejor sobre otras personas",
      "es muy cauteloso(a) antes de actuar",
      "no le interesan las discusiones que inciten a pensar",
      "no se apresura yendo de un lugar a otro"
    ]
  },
  // Grupo 34 - PARTE 4
  {
    id: 34,
    statements: [
      "no tiene una mente inquisitiva",
      "no actúa impulsivamente",
      "generalmente está desbordante de energía",
      "se irrita fácilmente por las debilidades de los demás"
    ]
  },
  // Grupo 35 - PARTE 4
  {
    id: 35,
    statements: [
      "puede realizar más cosas que otras personas",
      "le gusta correr riesgos sólo por la emoción de hacerlo",
      "se ofende cuando es criticado(a)",
      "prefiere trabajar con ideas que con cosas"
    ]
  },
  // Grupo 36 - PARTE 4
  {
    id: 36,
    statements: [
      "confía mucho en las personas",
      "prefiere desempeñar un trabajo rutinario y simple",
      "actúa impulsivamente",
      "está lleno(a) de vigor y energía"
    ]
  },
  // Grupo 37 - PARTE 4
  {
    id: 37,
    statements: [
      "toma decisiones muy rápidamente",
      "le simpatiza toda la gente",
      "mantiene un ritmo vivaz en el trabajo o el juego",
      "no tiene un gran interés en adquirir conocimientos"
    ]
  }
];

export default function TestPage() {
  const [session, setSession] = useState<any>(null);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [respuestas, setRespuestas] = useState<{ masParecido: number; menosParecido: number }[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [testCompletado, setTestCompletado] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);
  
  const [modalMensaje, setModalMensaje] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info"
  });
  
  const router = useRouter();

  useEffect(() => {
    const verificarProgreso = async () => {
      const res = await fetch("/api/test/progreso");
      const data = await res.json();
      if (data.completado) {
        setTestCompletado(true);
        setCargando(false);
        return;
      }
      
      if (!data.respuestas || data.respuestas.length === 0) {
        setMostrarInstrucciones(true);
      } else {
        const nuevasRespuestas = new Array(testGroups.length);
        data.respuestas.forEach((r: any) => {
          nuevasRespuestas[r.groupId] = {
            masParecido: r.masParecido,
            menosParecido: r.menosParecido
          };
        });
        setRespuestas(nuevasRespuestas);
        setCurrentGroup(data.grupoActual);
      }
      setCargando(false);
    };

    const cargarSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setSession(data);
      verificarProgreso();
    };

    cargarSession();
  }, [router]);

  const handleComenzarTest = () => {
    setMostrarInstrucciones(false);
  };

  const handleSeleccion = (groupIndex: number, masId: number, menosId: number) => {
    if (masId === menosId && masId !== -1 && menosId !== -1) {
      setModalMensaje({
        isOpen: true,
        title: "Selección inválida",
        message: "No puedes seleccionar la misma afirmación como 'Más parecido' y 'Menos parecido'",
        type: "info"
      });
      return;
    }
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[groupIndex] = { masParecido: masId, menosParecido: menosId };
    setRespuestas(nuevasRespuestas);
  };

  const guardarProgreso = async () => {
    setGuardando(true);
    try {
      const respuestasParaGuardar = respuestas
        .map((r, idx) => r ? { groupId: idx, masParecido: r.masParecido, menosParecido: r.menosParecido } : null)
        .filter(r => r !== null);

      const res = await fetch("/api/test/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respuestas: respuestasParaGuardar,
          grupoActual: currentGroup
        })
      });
      if (!res.ok) {
        setModalMensaje({
          isOpen: true,
          title: "Error",
          message: "Error al guardar el progreso",
          type: "error"
        });
      } else {
        setModalMensaje({
          isOpen: true,
          title: "✓ Progreso guardado",
          message: "Tus respuestas han sido guardadas correctamente. Puedes continuar después.",
          type: "success"
        });
      }
    } catch (error) {
      console.error(error);
      setModalMensaje({
        isOpen: true,
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor. Intenta nuevamente.",
        type: "error"
      });
    } finally {
      setGuardando(false);
    }
  };

  const finalizarTest = async () => {
    const respuestasValidas = respuestas.filter(r => r && r.masParecido !== undefined && r.menosParecido !== undefined);
    if (respuestasValidas.length < testGroups.length) {
      setModalMensaje({
        isOpen: true,
        title: "Test incompleto",
        message: `Debes responder todos los grupos antes de finalizar. Faltan ${testGroups.length - respuestasValidas.length} grupos.`,
        type: "info"
      });
      return;
    }
    
    setGuardando(true);
    try {
      const respuestasParaEnviar = respuestas.map((r, idx) => ({
        groupId: idx,
        masParecido: r.masParecido,
        menosParecido: r.menosParecido
      }));

      const res = await fetch("/api/test/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas: respuestasParaEnviar })
      });
      
      if (res.ok) {
        setModalMensaje({
          isOpen: true,
          title: "🎉 ¡Test completado!",
          message: "Has completado el test de personalidad. La psicóloga revisará tus puntajes.",
          type: "success"
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        const data = await res.json();
        setModalMensaje({
          isOpen: true,
          title: "Error",
          message: data.error || "Error al finalizar el test",
          type: "error"
        });
      }
    } catch (error) {
      console.error(error);
      setModalMensaje({
        isOpen: true,
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor.",
        type: "error"
      });
    } finally {
      setGuardando(false);
    }
  };

  // ✅ Función para reiniciar el test (Rehacer test)
  const handleRehacerTest = async () => {
    const res = await fetch("/api/test/reiniciar", { method: "POST" });
    if (res.ok) {
      // Limpiar estado local completamente
      setRespuestas([]);
      setCurrentGroup(0);
      setTestCompletado(false);
      setRespuestas(new Array(testGroups.length));
      // Redirigir al test
      router.push("/test");
    } else {
      alert("Error al reiniciar el test");
    }
  };

  const respuestasCompletadas = respuestas.filter(r => r && r.masParecido !== undefined && r.menosParecido !== undefined).length;
  const progreso = (respuestasCompletadas / testGroups.length) * 100;

  const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    titleSection: { display: 'flex', alignItems: 'center', gap: '1rem' },
    titleIcon: { fontSize: '2rem', color: '#4a90c4' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#2c3e50', margin: 0 },
    subtitle: { fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.25rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569', fontSize: '0.9rem' },
    progressSection: { background: '#f8fafc', borderRadius: '24px', padding: '1rem 1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' },
    progressBar: { background: '#e2e8f0', borderRadius: '12px', height: '10px', overflow: 'hidden' },
    progressFill: { background: 'linear-gradient(90deg, #4a90c4, #6ba3d6)', borderRadius: '12px', height: '100%', width: `${progreso}%` },
    progressText: { display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' },
    card: { background: 'white', borderRadius: '28px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    groupBadge: { display: 'inline-block', background: 'linear-gradient(135deg, #4a90c4, #6ba3d6)', color: 'white', padding: '0.3rem 1rem', borderRadius: '40px', fontSize: '0.75rem', fontWeight: '500', marginBottom: '1rem' },
    groupTitle: { fontSize: '1.3rem', fontWeight: '600', color: '#2c3e50', marginBottom: '1.5rem' },
    statementItem: { marginBottom: '1.5rem', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' },
    statementText: { fontSize: '1rem', color: '#2c3e50', marginBottom: '0.75rem', fontWeight: '500' },
    buttonGroup: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' as const },
    btnMas: (isSelected: boolean) => ({
      padding: '0.5rem 1.2rem',
      borderRadius: '40px',
      border: 'none',
      fontSize: '0.85rem',
      fontWeight: '500',
      cursor: 'pointer',
      background: isSelected ? '#10b981' : '#f1f5f9',
      color: isSelected ? 'white' : '#64748b'
    }),
    btnMenos: (isSelected: boolean) => ({
      padding: '0.5rem 1.2rem',
      borderRadius: '40px',
      border: 'none',
      fontSize: '0.85rem',
      fontWeight: '500',
      cursor: 'pointer',
      background: isSelected ? '#ef4444' : '#f1f5f9',
      color: isSelected ? 'white' : '#64748b'
    }),
    navigation: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' as const },
    navButton: { padding: '0.8rem 1.5rem', borderRadius: '40px', border: 'none', fontWeight: '500', cursor: 'pointer', background: '#e2e8f0', color: '#475569' },
    saveButton: { padding: '0.8rem 1.5rem', borderRadius: '40px', border: 'none', fontWeight: '500', cursor: 'pointer', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    finalizarButton: { padding: '0.8rem 1.8rem', borderRadius: '40px', border: 'none', fontWeight: '500', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ width: '50px', height: '50px', border: '3px solid #e2e8f0', borderTopColor: '#4a90c4', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
        <p style={{ color: '#64748b' }}>Cargando test...</p>
      </div>
    );
  }

  // ✅ CORREGIDO: Mostrar botón "Rehacer test" sin redirección automática
  if (testCompletado) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>✅ Ya completaste este test</h2>
        <p>Puedes volver a realizarlo haciendo clic en el botón.</p>
        <button 
          onClick={handleRehacerTest} 
          style={{ 
            padding: '0.8rem 1.5rem', 
            background: '#f59e0b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '40px', 
            cursor: 'pointer', 
            marginTop: '1rem' 
          }}
        >
          Rehacer test
        </button>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/dashboard" style={{ color: '#4a90c4' }}>Volver al dashboard</Link>
        </div>
      </div>
    );
  }

  const currentGroupData = testGroups[currentGroup];

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/dashboard" style={styles.backButton}>
            <FaArrowLeft /> Volver
          </Link>
          <div style={styles.titleSection}>
            <FaBrain style={styles.titleIcon} />
            <div>
              <h1 style={styles.title}>Test de Personalidad</h1>
              <p style={styles.subtitle}>Gordon Personal Profile Inventory (P-IPG)</p>
            </div>
          </div>
          <div style={{ width: '80px' }}></div>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <div style={styles.progressText}>
            <span>Progreso: {respuestasCompletadas} de {testGroups.length} grupos</span>
            <span>{Math.round(progreso)}% completado</span>
          </div>
        </div>

        {currentGroupData && (
          <div style={styles.card}>
            <div style={styles.groupBadge}>Grupo {currentGroup + 1} de {testGroups.length}</div>
            <h2 style={styles.groupTitle}>Selecciona las opciones</h2>
            {currentGroupData.statements.map((statement, idx) => {
              const currentRespuesta = respuestas[currentGroup];
              return (
                <div key={idx} style={styles.statementItem}>
                  <div style={styles.statementText}>
                    {idx + 1}. {statement}
                  </div>
                  <div style={styles.buttonGroup}>
                    <button
                      style={styles.btnMas(currentRespuesta?.masParecido === idx)}
                      onClick={() => handleSeleccion(currentGroup, idx, currentRespuesta?.menosParecido ?? -1)}
                    >
                      🔵 Más parecido
                    </button>
                    <button
                      style={styles.btnMenos(currentRespuesta?.menosParecido === idx)}
                      onClick={() => handleSeleccion(currentGroup, currentRespuesta?.masParecido ?? -1, idx)}
                    >
                      🔴 Menos parecido
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.navigation}>
          <button
            onClick={() => setCurrentGroup(Math.max(0, currentGroup - 1))}
            style={styles.navButton}
            disabled={currentGroup === 0}
          >
            ← Anterior
          </button>
          
          <button onClick={guardarProgreso} style={styles.saveButton} disabled={guardando}>
            <FaSave /> {guardando ? "Guardando..." : "Guardar progreso"}
          </button>
          
          {currentGroup === testGroups.length - 1 ? (
            <button onClick={finalizarTest} style={styles.finalizarButton} disabled={guardando}>
              <FaHeart /> Finalizar test
            </button>
          ) : (
            <button
              onClick={() => setCurrentGroup(Math.min(testGroups.length - 1, currentGroup + 1))}
              style={styles.navButton}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>

      <ModalInstrucciones
        isOpen={mostrarInstrucciones}
        onClose={() => router.push("/dashboard")}
        onConfirm={handleComenzarTest}
      />

      <ModalMensaje
        isOpen={modalMensaje.isOpen}
        onClose={() => setModalMensaje({ ...modalMensaje, isOpen: false })}
        title={modalMensaje.title}
        message={modalMensaje.message}
        type={modalMensaje.type}
      />
    </div>
  );
}