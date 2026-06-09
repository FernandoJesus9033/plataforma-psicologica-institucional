import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaEye, FaBrain, FaFileExcel } from "react-icons/fa";

export default async function TestResultadosPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  const isPsychologist = user?.role === "PSYCHOLOGIST";
  if (!isPsychologist) redirect("/dashboard");

  const resultados = await prisma.testResult.findMany({
    include: { student: true },
    orderBy: { completedAt: "desc" }
  });

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' },
    subtitle: { color: '#64748b', fontSize: '0.9rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '600' },
    td: { padding: '1rem', borderBottom: '1px solid #e2e8f0', color: '#2c3e50' },
    viewButton: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#4a90c4', color: 'white', borderRadius: '20px', textDecoration: 'none' },
    archivoBadge: (tiene: boolean) => ({
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '500',
      background: tiene ? '#d1fae5' : '#fef3c7', color: tiene ? '#065f46' : '#d97706'
    }),
    emptyState: { textAlign: 'center' as const, padding: '3rem', color: '#64748b' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <FaBrain style={{ color: '#4a90c4' }} />
          <h1 style={{ margin: 0 }}>Resultados del Test P-IPG</h1>
        </div>
        <p style={styles.subtitle}>Solo psicóloga - Revisa los test completados por los alumnos</p>
      </div>

      <div style={styles.card}>
        {resultados.length === 0 ? (
          <div style={styles.emptyState}>
            <FaFileExcel style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
            <p>No hay resultados registrados aún.</p>
            <p>Los alumnos deben subir su test completado.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Estudiante</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Archivo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}><strong>{r.student.name}</strong></td>
                  <td style={styles.td}>{r.student.email}</td>
                  <td style={styles.td}>{new Date(r.completedAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={styles.archivoBadge(!!r.archivoUrl)}>
                      <FaFileExcel size={12} />
                      {r.archivoUrl ? "Subido" : "Pendiente"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <Link href={`/test-resultados/${r.studentId}`} style={styles.viewButton}>
                      <FaEye /> Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}