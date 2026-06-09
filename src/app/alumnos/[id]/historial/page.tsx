import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Layout from "@/components/Layout";
import { FaArrowLeft, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { getStatusColor, getStatusDescription } from "@/lib/psychologicalStatus";
import NotasPrivadas from "@/components/NotasPrivadas";

export default async function HistorialAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const alumno = await prisma.student.findUnique({
    where: { id: id },
    include: {
      evaluations: {
        orderBy: { createdAt: "desc" }
      },
      appointments: {
        orderBy: { date: "desc" }
      }
    }
  });

  if (!alumno) {
    redirect("/alumnos");
  }

  const promedio = alumno.evaluations.length > 0
    ? (alumno.evaluations.reduce((acc, e) => acc + e.score, 0) / alumno.evaluations.length).toFixed(1)
    : "N/A";

  const ultimoEstado = alumno.evaluations.length > 0
    ? alumno.evaluations[0].status
    : "SIN EVALUAR";

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.8rem 1.5rem',
      background: '#f8fafc',
      color: '#64748b',
      textDecoration: 'none',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    },
    titleSection: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
    },
    statLabel: {
      color: '#64748b',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#0f172a',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.5rem 1.5rem',
      borderRadius: '30px',
      fontWeight: '600',
      fontSize: '1rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    tableContainer: {
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
      marginBottom: '2rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      background: '#f8fafc',
      color: '#0f172a',
      padding: '1rem',
      textAlign: 'left' as const,
      fontWeight: '600',
      fontSize: '0.95rem',
      borderBottom: '2px solid #e2e8f0',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
    },
    appointmentCard: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  const getStatusStyle = (status: string) => {
    const color = getStatusColor(status);
    return {
      ...styles.statusBadge,
      background: `${color}20`,
      color: color,
    };
  };

  return (
    <Layout session={session}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/alumnos" style={styles.backButton}>
            <FaArrowLeft /> Volver a Alumnos
          </Link>
        </div>

        <div style={styles.titleSection}>
          <h1 style={styles.title}>{alumno.name}</h1>
          <p style={styles.subtitle}>{alumno.email}</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Evaluaciones</div>
            <div style={styles.statValue}>{alumno.evaluations.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Promedio</div>
            <div style={styles.statValue}>{promedio}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Último Estado</div>
            <div>
              <span style={getStatusStyle(ultimoEstado)}>
                {getStatusDescription(ultimoEstado)}
              </span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Citas</div>
            <div style={styles.statValue}>{alumno.appointments.length}</div>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <h2 style={styles.sectionTitle}>
            <FaChartLine /> Historial de Evaluaciones
          </h2>
          {alumno.evaluations.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
              No hay evaluaciones registradas para este alumno.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Puntaje</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alumno.evaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td style={styles.td}>
                      {new Date(evaluation.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={styles.td}>{evaluation.score}</td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(evaluation.status)}>
                        {getStatusDescription(evaluation.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.tableContainer}>
          <h2 style={styles.sectionTitle}>
            <FaCalendarAlt /> Historial de Citas
          </h2>
          {alumno.appointments.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
              No hay citas registradas para este alumno.
            </p>
          ) : (
            <div>
              {alumno.appointments.map((appointment) => (
                <div key={appointment.id} style={styles.appointmentCard}>
                  <div>
                    <strong>
                      {new Date(appointment.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </strong>
                  </div>
                  <div>
                    {new Date(appointment.date).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notas Privadas */}
        <NotasPrivadas studentId={alumno.id} />
      </div>
    </Layout>
  );
}