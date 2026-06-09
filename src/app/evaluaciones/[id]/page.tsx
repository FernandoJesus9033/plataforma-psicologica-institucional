import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Layout from "@/components/Layout";
import { FaArrowLeft, FaStar, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";

export default async function DetalleEvaluacionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const evaluacion = await prisma.evaluation.findUnique({
    where: { id: params.id },
    include: { student: true }
  });

  if (!evaluacion) {
    redirect("/evaluaciones");
  }

  const styles = {
    container: {
      maxWidth: '800px',
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
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '2.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '2rem',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    infoItem: {
      padding: '1rem',
      background: '#f8fafc',
      borderRadius: '12px',
    },
    infoLabel: {
      color: '#64748b',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    infoValue: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#0f172a',
    },
    scoreDisplay: {
      textAlign: 'center' as const,
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea15, #764ba215)',
      borderRadius: '16px',
      marginBottom: '2rem',
    },
    score: {
      fontSize: '4rem',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '0.5rem',
    },
    scoreLabel: {
      color: '#64748b',
      fontSize: '1rem',
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      background: '#f8fafc',
      borderRadius: '12px',
    },
    studentAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '600',
    },
  };

  return (
    <Layout session={session}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/evaluaciones" style={styles.backButton}>
            <FaArrowLeft /> Volver a Evaluaciones
          </Link>
        </div>

        <div style={styles.card}>
          <h1 style={styles.title}>Detalle de Evaluación</h1>

          <div style={styles.studentInfo}>
            <div style={styles.studentAvatar}>
              {evaluacion.student.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
                {evaluacion.student.name}
              </div>
              <div style={{ color: '#64748b', marginTop: '0.25rem' }}>
                {evaluacion.student.email}
              </div>
            </div>
          </div>

          <div style={styles.scoreDisplay}>
            <div style={styles.score}>{evaluacion.score}</div>
            <div style={styles.scoreLabel}>Puntaje obtenido</div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <FaCalendarAlt color="#667eea" /> Fecha
              </div>
              <div style={styles.infoValue}>
                {new Date(evaluacion.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <FaStar color="#f59e0b" /> Nivel
              </div>
              <div style={styles.infoValue}>
                {evaluacion.score >= 8 ? 'Excelente' : 
                 evaluacion.score >= 5 ? 'Regular' : 'Necesita mejorar'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link 
              href={`/evaluaciones/${evaluacion.id}/editar`}
              style={{
                padding: '0.8rem 2rem',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                marginRight: '1rem',
              }}
            >
              Editar Evaluación
            </Link>
            <Link 
              href={`/evaluaciones/${evaluacion.id}/eliminar`}
              style={{
                padding: '0.8rem 2rem',
                background: '#ef4444',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
              }}
            >
              Eliminar
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}