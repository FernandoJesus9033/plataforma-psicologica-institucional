"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import ModalConfirmacion from "@/components/ModalConfirmacion";
import { FaRedoAlt, FaChartLine, FaBrain } from "react-icons/fa";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Legend
} from "recharts";

// ==========================================
// TABLA DE PERCENTILES (Cuadro 2-2)
// ==========================================
function getPercentil(puntaje: number): number {
  if (puntaje >= 37) return 99;
  if (puntaje >= 36) return 98;
  if (puntaje >= 35) return 98;
  if (puntaje >= 34) return 98;
  if (puntaje >= 33) return 98;
  if (puntaje >= 32) return 99;
  if (puntaje >= 31) return 98;
  if (puntaje >= 30) return 96;
  if (puntaje >= 29) return 93;
  if (puntaje >= 28) return 89;
  if (puntaje >= 27) return 84;
  if (puntaje >= 26) return 79;
  if (puntaje >= 25) return 73;
  if (puntaje >= 24) return 67;
  if (puntaje >= 23) return 61;
  if (puntaje >= 22) return 54;
  if (puntaje >= 21) return 47;
  if (puntaje >= 20) return 41;
  if (puntaje >= 19) return 35;
  if (puntaje >= 18) return 29;
  if (puntaje >= 17) return 23;
  if (puntaje >= 16) return 18;
  if (puntaje >= 15) return 14;
  if (puntaje >= 14) return 11;
  if (puntaje >= 13) return 8;
  if (puntaje >= 12) return 5;
  if (puntaje >= 11) return 3;
  if (puntaje >= 10) return 2;
  if (puntaje >= 9) return 1;
  if (puntaje >= 8) return 0;
  return 0;
}

function getInterpretacion(percentil: number) {
  if (percentil <= 10) return { texto: "Muy Bajo", color: "#ef4444" };
  if (percentil <= 30) return { texto: "Bajo", color: "#f97316" };
  if (percentil <= 70) return { texto: "Promedio", color: "#f59e0b" };
  if (percentil <= 90) return { texto: "Alto", color: "#8b5cf6" };
  return { texto: "Muy Alto", color: "#10b981" };
}

const escalas = [
  { key: "A", label: "Ascendencia", descripcion: "Liderazgo, iniciativa, seguridad", color: "#4a90c4" },
  { key: "R", label: "Responsabilidad", descripcion: "Confiabilidad, persistencia", color: "#10b981" },
  { key: "E", label: "Estabilidad Emocional", descripcion: "Control emocional, calma", color: "#f59e0b" },
  { key: "S", label: "Sociabilidad", descripcion: "Apertura social, amistad", color: "#8b5cf6" },
  { key: "AE", label: "Autoestima", descripcion: "Confianza en sí mismo", color: "#ec489a" },
  { key: "C", label: "Cautela", descripcion: "Prudencia, deliberación", color: "#06b6d4" },
  { key: "O", label: "Originalidad", descripcion: "Creatividad, nuevas ideas", color: "#f97316" },
  { key: "P", label: "Relaciones Interpersonales", descripcion: "Empatía, trato con otros", color: "#14b8a6" },
  { key: "V", label: "Vigor", descripcion: "Energía, dinamismo", color: "#eab308" }
];

export default function MisResultadosPage() {
  const [session, setSession] = useState<any>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [reiniciando, setReiniciando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setSession(data);

      const testRes = await fetch("/api/test-resultados/mis-resultados");
      if (testRes.ok) {
        const data = await testRes.json();
        setResultado(data);
      } else if (testRes.status === 404) {
        setResultado(null);
      }
      setCargando(false);
    };
    cargarDatos();
  }, [router]);

  const handleRehacerTest = async () => {
    setReiniciando(true);
    try {
      const res = await fetch("/api/test/reiniciar", { method: "POST" });
      if (res.ok) {
        router.push("/test");
      } else {
        alert("Error al reiniciar el test");
        setReiniciando(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
      setReiniciando(false);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-color)' },
    rehacerButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '500', cursor: 'pointer' },
    card: { background: 'var(--card-bg)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' },
    radarContainer: { height: '400px', width: '100%', marginBottom: '1rem' },
    chartContainer: { height: '400px', width: '100%', marginBottom: '1rem' },
    scoreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' },
    scoreItem: (color: string) => ({ background: '#f8fafc', borderRadius: '12px', padding: '1rem', borderLeft: `4px solid ${color}` }),
    scoreLabel: { fontWeight: '600', color: 'var(--text-color)' },
    scoreValue: { fontSize: '1.5rem', fontWeight: 'bold' },
    scoreDesc: { fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' },
    percentileBadge: (percentil: number) => {
      const interp = getInterpretacion(percentil);
      return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '500', background: `${interp.color}20`, color: interp.color };
    },
    sinTest: { textAlign: 'center' as const, padding: '3rem' },
    sinTestButton: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '500', cursor: 'pointer', marginTop: '1rem' }
  };

  if (cargando) {
    return (
      <Layout session={session}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando resultados...</div>
      </Layout>
    );
  }

  if (!resultado || !resultado.scores) {
    return (
      <Layout session={session}>
        <div style={styles.sinTest}>
          <h2>📋 No has realizado el test aún</h2>
          <p>Completa el test de personalidad para ver tus resultados.</p>
          <button onClick={() => router.push("/test")} style={styles.sinTestButton}>
            Comenzar test
          </button>
        </div>
      </Layout>
    );
  }

  const scores = resultado.scores;
  const datosRadar = escalas.map(e => ({
    subject: e.label,
    value: scores[e.key] || 0,
    fullMark: 28
  }));

  const datosBarras = escalas.map(e => ({
    escala: e.label,
    puntaje: scores[e.key] || 0,
    color: e.color
  }));

  return (
    <Layout session={session}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FaBrain /> Mis Resultados
          </h1>
          <button onClick={() => setModalOpen(true)} style={styles.rehacerButton} disabled={reiniciando}>
            <FaRedoAlt /> {reiniciando ? "Reiniciando..." : "Rehacer test"}
          </button>
        </div>

        <div style={styles.card}>
          <h3><FaChartLine /> Perfil de Personalidad</h3>
          <div style={styles.radarContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={datosRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 28]} tickCount={8} />
                <Radar name="Puntaje" dataKey="value" stroke="#4a90c4" fill="#4a90c4" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.card}>
          <h3><FaChartLine /> Puntajes por Escala</h3>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosBarras} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="escala" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 28]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="puntaje" name="Puntaje" radius={[8, 8, 0, 0]}>
                  {datosBarras.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Detalle de Puntajes</h3>
          <div style={styles.scoreGrid}>
            {escalas.map(escala => {
              const puntaje = scores[escala.key] || 0;
              const percentil = getPercentil(puntaje);
              const interp = getInterpretacion(percentil);
              return (
                <div key={escala.key} style={styles.scoreItem(escala.color)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={styles.scoreLabel}>{escala.label}</div>
                      <div style={styles.scoreDesc}>{escala.descripcion}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...styles.scoreValue, color: escala.color }}>{puntaje}</div>
                      <div>
                        <span style={styles.percentileBadge(percentil)}>
                          Percentil {percentil}% - {interp.texto}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
            Test completado: {new Date(resultado.completedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRehacerTest}
        title="Rehacer test"
        message="Al rehacer el test, perderás todas tus respuestas y resultados anteriores. ¿Estás seguro?"
        confirmText="Sí, rehacer"
        cancelText="Cancelar"
      />
    </Layout>
  );
}