"use client";

import { useEffect, useState } from "react";

export default function MisEvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/evaluations");
        if (res.ok) {
          setEvaluaciones(await res.json());
        } else if (res.status === 503) {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b', marginBottom: '1.5rem' },
    tableContainer: { background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { background: '#667eea', color: 'white', padding: '1rem', textAlign: 'left' as const },
    td: { padding: '1rem', borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
    emptyState: { textAlign: 'center' as const, padding: '4rem', color: '#64748b' },
    maintenanceCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center' as const, maxWidth: '500px', margin: '0 auto' },
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

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>📊 Mis Evaluaciones</h1>
        <div style={styles.maintenanceCard}>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem' }}>Próximamente disponible.</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>⚠️ En proceso de migración a Netlify Blobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Mis Evaluaciones</h1>
      <p style={styles.subtitle}>Consulta tus evaluaciones psicológicas</p>

      {evaluaciones.length === 0 ? (
        <div style={styles.emptyState}>No hay evaluaciones registradas aún.</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Puntaje</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((e) => (
                <tr key={e.id}>
                  <td style={styles.td}>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>{e.score}</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(e.score)}>
                      {e.status === "GREEN" ? "Estable" : e.status === "YELLOW" ? "En observación" : "Requiere atención"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}