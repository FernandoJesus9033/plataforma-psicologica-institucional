"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  FaArrowLeft, FaDownload, FaUserGraduate, FaEnvelope, FaCalendarAlt, 
  FaChartLine, FaClipboardList, FaTasks, FaCheckCircle, FaClock, FaStar,
  FaBrain, FaHeartbeat
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Alumno {
  id: string;
  name: string;
  email: string;
  notes: string | null;
  createdAt: string;
}

interface Evaluacion {
  id: string;
  score: number;
  status: string;
  createdAt: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  status: string;
  grade: number | null;
  dueDate: string;
}

interface Appointment {
  id: string;
  date: string;
}

// Tabla de percentiles según el manual Gordon P-IPG
const percentilesTable: Record<string, Record<number, number>> = {
  A: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  R: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  E: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  S: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  AE: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  C: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  O: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  P: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 },
  V: { 28: 99, 27: 98, 26: 96, 25: 93, 24: 89, 23: 84, 22: 79, 21: 73, 20: 67, 19: 61, 18: 54, 17: 47, 16: 41, 15: 35, 14: 29, 13: 23, 12: 18, 11: 14, 10: 11, 9: 8, 8: 5, 7: 3, 6: 2, 5: 1, 4: 0 }
};

function getPercentile(scale: string, score: number): number {
  const table = percentilesTable[scale];
  if (!table) return 0;
  const sortedScores = Object.keys(table).map(Number).sort((a,b) => b - a);
  for (const s of sortedScores) {
    if (score >= s) return table[s];
  }
  return 0;
}

function getInterpretation(percentile: number): { text: string; color: string; range: string } {
  if (percentile <= 10) return { text: "Muy Bajo", color: "#ef4444", range: "0-10" };
  if (percentile <= 30) return { text: "Bajo", color: "#f97316", range: "11-30" };
  if (percentile <= 70) return { text: "Promedio", color: "#f59e0b", range: "31-70" };
  if (percentile <= 90) return { text: "Alto", color: "#8b5cf6", range: "71-90" };
  return { text: "Muy Alto", color: "#10b981", range: "91-100" };
}

export default function ExpedientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const { themeStyles } = useTheme();
  const router = useRouter();
  const expedienteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      if (!sessionData?.user) {
        router.push("/login");
        return;
      }
      setSession(sessionData);

      const isPsychologist = sessionData.user?.role === "PSYCHOLOGIST";
      if (!isPsychologist) {
        router.push("/dashboard");
        return;
      }

      const [alumnoRes, evaluacionesRes, actividadesRes, citasRes, testRes] = await Promise.all([
        fetch(`/api/alumnos/${id}`),
        fetch(`/api/evaluations?studentId=${id}`),
        fetch(`/api/activities/student/${id}`),
        fetch(`/api/appointments/student/${id}`),
        fetch(`/api/test/results/${id}`)
      ]);

      if (alumnoRes.ok) setAlumno(await alumnoRes.json());
      if (evaluacionesRes.ok) setEvaluaciones(await evaluacionesRes.json());
      if (actividadesRes.ok) setActividades(await actividadesRes.json());
      if (citasRes.ok) setCitas(await citasRes.json());
      if (testRes.ok) {
        const data = await testRes.json();
        setTestResults(data);
      }

      setLoading(false);
    };
    loadData();
  }, [id, router]);

  const downloadPDF = async () => {
    if (!expedienteRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(expedienteRef.current, { scale: 2, logging: false, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`expediente_${alumno?.name || "alumno"}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setDownloading(false);
    }
  };

  // Preparar datos para gráficas
  const testScores = testResults ? [
    { escala: "Ascendencia", valor: testResults.A || 0, color: "#4a90c4", percentil: getPercentile("A", testResults.A || 0) },
    { escala: "Responsabilidad", valor: testResults.R || 0, color: "#10b981", percentil: getPercentile("R", testResults.R || 0) },
    { escala: "Estabilidad Emocional", valor: testResults.E || 0, color: "#f59e0b", percentil: getPercentile("E", testResults.E || 0) },
    { escala: "Sociabilidad", valor: testResults.S || 0, color: "#8b5cf6", percentil: getPercentile("S", testResults.S || 0) },
    { escala: "Autoestima", valor: testResults.AE || 0, color: "#ec489a", percentil: getPercentile("AE", testResults.AE || 0) },
    { escala: "Cautela", valor: testResults.C || 0, color: "#06b6d4", percentil: getPercentile("C", testResults.C || 0) },
    { escala: "Originalidad", valor: testResults.O || 0, color: "#f97316", percentil: getPercentile("O", testResults.O || 0) },
    { escala: "Relaciones", valor: testResults.P || 0, color: "#14b8a6", percentil: getPercentile("P", testResults.P || 0) },
    { escala: "Vigor", valor: testResults.V || 0, color: "#eab308", percentil: getPercentile("V", testResults.V || 0) }
  ] : [];

  const radarData = testScores.map(s => ({ subject: s.escala, value: s.valor, fullMark: 28 }));

  const promedioEvaluaciones = evaluaciones.length > 0
    ? (evaluaciones.reduce((acc, e) => acc + e.score, 0) / evaluaciones.length).toFixed(1)
    : "N/A";
  const actividadesCompletadas = actividades.filter(a => a.status === "COMPLETED").length;
  const actividadesPendientes = actividades.filter(a => a.status === "PENDING").length;
  const citasProximas = citas.filter(c => new Date(c.date) > new Date()).length;

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.8rem', fontWeight: 'bold', color: themeStyles.textColor, display: 'flex', alignItems: 'center', gap: '0.5rem' },
    downloadButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: '#4a90c4', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' },
    card: { background: themeStyles.cardBg, borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', border: `1px solid ${themeStyles.borderColor}`, boxShadow: themeStyles.shadow },
    cardTitle: { fontSize: '1.2rem', fontWeight: '600', color: themeStyles.textColor, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
    infoItem: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '12px' },
    infoIcon: { fontSize: '1.3rem', color: '#4a90c4' },
    infoLabel: { fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' as const },
    infoValue: { fontSize: '1rem', fontWeight: '600', color: themeStyles.textColor },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { background: '#f8fafc', borderRadius: '12px', padding: '1rem', textAlign: 'center' as const },
    statNumber: { fontSize: '1.5rem', fontWeight: 'bold', color: '#4a90c4' },
    statLabel: { fontSize: '0.7rem', color: '#64748b' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '0.8rem', borderBottom: `1px solid ${themeStyles.borderColor}`, color: themeStyles.textColor },
    td: { padding: '0.8rem', borderBottom: `1px solid ${themeStyles.borderColor}`, color: themeStyles.textColor },
    statusBadge: (status: string) => {
      const colors: Record<string, string> = {
        GREEN: '#10b981', YELLOW: '#f59e0b', RED: '#ef4444',
        PENDING: '#f59e0b', COMPLETED: '#10b981', GRADED: '#8b5cf6'
      };
      return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '500', background: `${colors[status]}20`, color: colors[status] };
    },
    chartContainer: { height: '400px', marginBottom: '1rem' },
    radarContainer: { height: '350px', marginBottom: '1rem' },
    scoreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' },
    scoreItem: { background: '#f8fafc', borderRadius: '12px', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    scoreLabel: { fontWeight: '500', color: themeStyles.textColor },
    scoreValue: { fontWeight: 'bold', fontSize: '1.2rem' },
    percentileBadge: (percentile: number) => {
      const interp = getInterpretation(percentile);
      return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '500', background: `${interp.color}20`, color: interp.color };
    }
  };

  if (loading) {
    return (
      <Layout session={session}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando expediente...</div>
      </Layout>
    );
  }

  if (!alumno) {
    return (
      <Layout session={session}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>Alumno no encontrado</div>
      </Layout>
    );
  }

  return (
    <Layout session={session}>
      <div ref={expedienteRef} style={styles.container}>
        {/* Encabezado */}
        <div style={styles.header}>
          <Link href="/alumnos" style={styles.backButton}>
            <FaArrowLeft /> Volver a Alumnos
          </Link>
          <h1 style={styles.title}>
            <FaUserGraduate /> Expediente del Alumno
          </h1>
          <button onClick={downloadPDF} style={styles.downloadButton} disabled={downloading}>
            <FaDownload /> {downloading ? "Generando PDF..." : "Descargar PDF"}
          </button>
        </div>

        {/* Datos personales */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><FaUserGraduate /> Datos Personales</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}><FaUserGraduate style={styles.infoIcon} /><div><div style={styles.infoLabel}>Nombre completo</div><div style={styles.infoValue}>{alumno.name}</div></div></div>
            <div style={styles.infoItem}><FaEnvelope style={styles.infoIcon} /><div><div style={styles.infoLabel}>Correo electrónico</div><div style={styles.infoValue}>{alumno.email}</div></div></div>
            <div style={styles.infoItem}><FaCalendarAlt style={styles.infoIcon} /><div><div style={styles.infoLabel}>Fecha de registro</div><div style={styles.infoValue}>{new Date(alumno.createdAt).toLocaleDateString()}</div></div></div>
          </div>
        </div>

        {/* Resumen de actividad */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><FaChartLine /> Resumen de Actividad</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><div style={styles.statNumber}>{evaluaciones.length}</div><div style={styles.statLabel}>Evaluaciones realizadas</div></div>
            <div style={styles.statCard}><div style={styles.statNumber}>{promedioEvaluaciones}</div><div style={styles.statLabel}>Promedio de puntaje</div></div>
            <div style={styles.statCard}><div style={styles.statNumber}>{actividadesCompletadas}/{actividades.length}</div><div style={styles.statLabel}>Actividades completadas</div></div>
            <div style={styles.statCard}><div style={styles.statNumber}>{citasProximas}</div><div style={styles.statLabel}>Próximas citas</div></div>
          </div>
        </div>

        {/* Resultados del test de personalidad */}
        {testResults && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}><FaBrain /> Perfil de Personalidad (Gordon P-IPG)</h2>
            
            {/* Gráfica de radar */}
            <div style={styles.radarContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 28]} tickCount={7} />
                  <Radar name="Puntajes" dataKey="value" stroke="#4a90c4" fill="#4a90c4" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica de barras con percentiles */}
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testScores} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="escala" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 28]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" name="Puntaje" radius={[8, 8, 0, 0]}>
                    {testScores.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de puntajes con percentiles e interpretación */}
            <div style={styles.scoreGrid}>
              {testScores.map(score => {
                const interp = getInterpretation(score.percentil);
                return (
                  <div key={score.escala} style={styles.scoreItem}>
                    <div>
                      <div style={styles.scoreLabel}>{score.escala}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Percentil {score.percentil}%</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.scoreValue}>{score.valor}</div>
                      <span style={styles.percentileBadge(score.percentil)}>{interp.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>
              Test completado: {testResults.completedAt ? new Date(testResults.completedAt).toLocaleDateString() : "Fecha no disponible"}
            </div>
          </div>
        )}

        {/* Historial de evaluaciones */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><FaClipboardList /> Evaluaciones Psicológicas</h2>
          {evaluaciones.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No hay evaluaciones registradas</p>
          ) : (
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Fecha</th><th style={styles.th}>Puntaje</th><th style={styles.th}>Estado</th></tr></thead>
              <tbody>
                {evaluaciones.map(e => (
                  <tr key={e.id}>
                    <td style={styles.td}>{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>{e.score}</td>
                    <td style={styles.td}><span style={styles.statusBadge(e.status)}>{e.status === "GREEN" ? "Estable" : e.status === "YELLOW" ? "En observación" : "Requiere atención"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Actividades asignadas */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><FaTasks /> Actividades Asignadas</h2>
          {actividades.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No hay actividades asignadas</p>
          ) : (
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Título</th><th style={styles.th}>Estado</th><th style={styles.th}>Calificación</th><th style={styles.th}>Fecha límite</th></tr></thead>
              <tbody>
                {actividades.map(a => (
                  <tr key={a.id}>
                    <td style={styles.td}>{a.title}</td>
                    <td style={styles.td}><span style={styles.statusBadge(a.status)}>{a.status === "PENDING" ? "Pendiente" : a.status === "COMPLETED" ? "Completada" : "Calificada"}</span></td>
                    <td style={styles.td}>{a.grade ? `${a.grade}/100` : "-"}</td>
                    <td style={styles.td}>{new Date(a.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Citas */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><FaCalendarAlt /> Historial de Citas</h2>
          {citas.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No hay citas registradas</p>
          ) : (
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Fecha</th><th style={styles.th}>Hora</th></tr></thead>
              <tbody>
                {citas.map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{new Date(c.date).toLocaleDateString()}</td>
                    <td style={styles.td}>{new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Notas privadas */}
        {alumno.notes && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}><FaHeartbeat /> Notas Privadas</h2>
            <p style={{ whiteSpace: 'pre-wrap', color: themeStyles.textColor }}>{alumno.notes}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}