import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaArrowLeft, FaBrain, FaUser, FaDownload, FaFileExcel } from "react-icons/fa";

export default async function TestResultadoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  const isPsychologist = user?.role === "PSYCHOLOGIST";
  if (!isPsychologist) redirect("/dashboard");

  const resultado = await prisma.testResult.findUnique({
    where: { studentId: id },
    include: { student: true }
  });

  if (!resultado) redirect("/test-resultados");

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' as const },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#2c3e50' },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    studentInfo: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
    studentName: { fontSize: '1.3rem', fontWeight: '600', color: '#2c3e50', margin: 0 },
    studentEmail: { color: '#64748b', margin: 0 },
    fileLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#eef2ff', borderRadius: '30px', textDecoration: 'none', color: '#4f46e5' },
    date: { color: '#64748b', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' as const }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/test-resultados" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>
          <FaBrain /> Test Completado
        </h1>
      </div>

      {/* Datos del estudiante */}
      <div style={styles.card}>
        <div style={styles.studentInfo}>
          <FaUser style={{ fontSize: '2rem', color: '#4a90c4' }} />
          <div>
            <h2 style={styles.studentName}>{resultado.student.name}</h2>
            <p style={styles.studentEmail}>{resultado.student.email}</p>
          </div>
        </div>
      </div>

      {/* Archivo subido por el alumno */}
      {resultado.archivoUrl ? (
        <div style={styles.card}>
          <h3><FaFileExcel /> Test completado</h3>
          <p>El alumno subió su test completado en Excel:</p>
          <a href={resultado.archivoUrl} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
            <FaDownload /> {resultado.archivoNombre || "Descargar Excel"}
          </a>
          <div style={styles.date}>
            Subido: {new Date(resultado.completedAt).toLocaleDateString()}
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <p style={{ textAlign: 'center', color: '#64748b' }}>El alumno aún no ha subido su test completado.</p>
        </div>
      )}
    </div>
  );
}