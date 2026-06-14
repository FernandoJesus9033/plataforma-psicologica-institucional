"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaUsers, FaChartLine, FaCalendarAlt, FaStar, FaUserGraduate, 
  FaClipboardList, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaCalendarCheck 
} from "react-icons/fa";

export default function EstadisticasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAlumnos: 0,
    totalEvaluaciones: 0,
    totalCitas: 0,
    promedio: "0.0",
    estadoVerde: 0,
    estadoAmarillo: 0,
    estadoRojo: 0,
    proximasCitas: 0,
    ultimasEvaluaciones: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.role === "PSYCHOLOGIST") {
      cargarEstadisticas();
    } else if (session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const cargarEstadisticas = async () => {
    try {
      const res = await fetch("/api/estadisticas");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: {
      background: 'linear-gradient(135deg, #4a90c4 0%, #357a9e 100%)',
      borderRadius: '24px',
      padding: '2rem',
      marginBottom: '2rem',
      color: 'white',
      textAlign: 'center' as const,
    },
    headerTitle: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' },
    headerSubtitle: { opacity: 0.9, fontSize: '1rem' },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem',
      textAlign: 'center' as const,
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
    },
    statIcon: { fontSize: '2rem', marginBottom: '0.75rem' },
    statValue: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', lineHeight: 1.2 },
    statLabel: { color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' },
    semaforoSection: {
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid #e2e8f0',
    },
    semaforoTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    semaforoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
    },
    semaforoCard: (color: string, bgColor: string) => ({
      background: bgColor,
      borderRadius: '16px',
      padding: '1rem',
      textAlign: 'center' as const,
      border: `1px solid ${color}20`,
    }),
    semaforoValue: (color: string) => ({ fontSize: '2rem', fontWeight: 'bold', color: color }),
    semaforoLabel: { fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' },
    twoColumns: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' },
    citasCard: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', height: '100%' },
    citasTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    citasNumber: { fontSize: '2rem', fontWeight: 'bold', color: '#4a90c4', marginBottom: '0.25rem' },
    citasText: { color: '#64748b' },
    evaluacionesCard: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', height: '100%' },
    evaluacionesTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    evaluacionesList: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
    evaluacionItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' },
    evaluacionNombre: { fontWeight: '500', color: '#1e293b' },
    evaluacionScore: (score: number) => ({ fontWeight: 'bold', color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }),
    upcomingCard: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    upcomingTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    upcomingGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
    upcomingItem: { background: '#f8fafc', borderRadius: '12px', padding: '0.8rem', textAlign: 'center' as const, color: '#475569', fontSize: '0.85rem' },
    backButton: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', padding: '0.8rem 1.5rem', background: '#f1f5f9', color: '#475569', textDecoration: 'none', borderRadius: '12px', fontWeight: '500' },
  };

  const responsiveStyles = `
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .two-columns { grid-template-columns: 1fr !important; }
      .upcoming-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr !important; }
      .semaforo-grid { grid-template-columns: 1fr !important; }
      .upcoming-grid { grid-template-columns: 1fr !important; }
    }
  `;

  if (status === "loading" || loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  }

  if (session?.user?.role !== "PSYCHOLOGIST") {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Acceso no autorizado</div>;
  }

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}><FaChartLine /> Estadísticas</h1>
          <p style={styles.headerSubtitle}>Visualiza el rendimiento y actividad de la plataforma</p>
        </div>

        <div className="stats-grid" style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#4a90c4'}}><FaUserGraduate /></div>
            <div style={styles.statValue}>{stats.totalAlumnos}</div>
            <div style={styles.statLabel}>Total Alumnos</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#10b981'}}><FaClipboardList /></div>
            <div style={styles.statValue}>{stats.totalEvaluaciones}</div>
            <div style={styles.statLabel}>Evaluaciones</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#f59e0b'}}><FaCalendarAlt /></div>
            <div style={styles.statValue}>{stats.totalCitas}</div>
            <div style={styles.statLabel}>Citas Agendadas</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#8b5cf6'}}><FaStar /></div>
            <div style={styles.statValue}>{stats.promedio}</div>
            <div style={styles.statLabel}>Promedio General</div>
          </div>
        </div>

        {(stats.totalEvaluaciones > 0 || true) && (
          <div style={styles.semaforoSection}>
            <h2 style={styles.semaforoTitle}><FaChartLine /> Distribución de Estados</h2>
            <div className="semaforo-grid" style={styles.semaforoGrid}>
              <div style={styles.semaforoCard("#10b981", "#10b98110")}>
                <div style={styles.semaforoValue("#10b981")}>{stats.estadoVerde}</div>
                <div style={styles.semaforoLabel}>🟢 Estable</div>
              </div>
              <div style={styles.semaforoCard("#f59e0b", "#f59e0b10")}>
                <div style={styles.semaforoValue("#f59e0b")}>{stats.estadoAmarillo}</div>
                <div style={styles.semaforoLabel}>🟡 En observación</div>
              </div>
              <div style={styles.semaforoCard("#ef4444", "#ef444410")}>
                <div style={styles.semaforoValue("#ef4444")}>{stats.estadoRojo}</div>
                <div style={styles.semaforoLabel}>🔴 Requiere atención</div>
              </div>
            </div>
          </div>
        )}

        <div className="two-columns" style={styles.twoColumns}>
          <div style={styles.citasCard}>
            <h2 style={styles.citasTitle}><FaCalendarCheck /> Próximas citas</h2>
            <div style={styles.citasNumber}>{stats.proximasCitas}</div>
            <p style={styles.citasText}>
              {stats.proximasCitas === 1 
                ? "cita programada en los próximos 7 días"
                : `citas programadas en los próximos 7 días`}
            </p>
          </div>

          <div style={styles.evaluacionesCard}>
            <h2 style={styles.evaluacionesTitle}><FaClipboardList /> Últimas evaluaciones</h2>
            {stats.ultimasEvaluaciones.length === 0 ? (
              <p style={{ color: '#64748b' }}>No hay evaluaciones recientes</p>
            ) : (
              <div style={styles.evaluacionesList}>
                {stats.ultimasEvaluaciones.map((evaluacion: any) => (
                  <div key={evaluacion.id} style={styles.evaluacionItem}>
                    <span style={styles.evaluacionNombre}>{evaluacion.studentName}</span>
                    <span style={styles.evaluacionScore(evaluacion.score)}>{evaluacion.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.upcomingCard}>
          <h2 style={styles.upcomingTitle}><FaChartLine /> Próximamente</h2>
          <div className="upcoming-grid" style={styles.upcomingGrid}>
            <div style={styles.upcomingItem}>📊 Gráficas de rendimiento</div>
            <div style={styles.upcomingItem}>📈 Evolución de evaluaciones</div>
            <div style={styles.upcomingItem}>👥 Estadísticas por alumno</div>
            <div style={styles.upcomingItem}>📅 Calendario de citas</div>
          </div>
        </div>

        <Link href="/dashboard" style={styles.backButton}>
          <FaArrowLeft /> Volver al Dashboard
        </Link>
      </div>
    </>
  );
}