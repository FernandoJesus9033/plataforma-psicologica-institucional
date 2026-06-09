import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function MisEvaluacionesPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  const estudiante = await prisma.student.findFirst({
    where: { email: user?.email },
    include: { evaluations: { orderBy: { createdAt: "desc" } } }
  });

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--secondary-text)', marginBottom: '1.5rem' },
    tableContainer: { background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { background: '#667eea', color: 'white', padding: '1rem', textAlign: 'left' as const },
    td: { padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-color)' },
    emptyState: { textAlign: 'center' as const, padding: '4rem', color: 'var(--secondary-text)' },
    statusBadge: (score: number) => ({
      display: 'inline-block',
      padding: '0.2rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
      background: score >= 80 ? '#10b98120' : score >= 50 ? '#f59e0b20' : '#ef444420',
      color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
    }),
  };

  const evaluaciones = estudiante?.evaluations || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Mis Evaluaciones</h1>
      <p style={styles.subtitle}>Consulta tus evaluaciones psicológicas</p>

      {evaluaciones.length === 0 ? (
        <div style={styles.emptyState}>No hay evaluaciones registradas aún.</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead><td><th style={styles.th}>Fecha</th><th style={styles.th}>Puntaje</th><th style={styles.th}>Estado</th></tr></thead>
            <tbody>
              {evaluaciones.map((e) => (
                <tr key={e.id}>
                  <td style={styles.td}>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>{e.score}</td>
                  <td style={styles.td}><span style={styles.statusBadge(e.score)}>{e.status === "GREEN" ? "Estable" : e.status === "YELLOW" ? "En observación" : "Requiere atención"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}