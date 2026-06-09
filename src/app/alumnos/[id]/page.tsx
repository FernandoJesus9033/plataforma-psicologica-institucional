"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { FaArrowLeft, FaEdit, FaTrash, FaClipboardList, FaCalendarAlt, FaBrain } from "react-icons/fa";

export default function AlumnoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [alumno, setAlumno] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { themeStyles } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const loadAlumno = async () => {
      const res = await fetch(`/api/alumnos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAlumno(data);
      }
      setLoading(false);
    };
    loadAlumno();
  }, [id]);

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' as const },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: themeStyles.textColor, margin: 0 },
    card: { background: themeStyles.cardBg, borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${themeStyles.borderColor}`, boxShadow: themeStyles.shadow },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' },
    statCard: { background: '#f8fafc', borderRadius: '12px', padding: '1rem', textAlign: 'center' as const },
    statValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#4a90c4' },
    statLabel: { color: '#64748b', fontSize: '0.8rem' },
    sectionTitle: { fontSize: '1.2rem', fontWeight: '600', color: themeStyles.textColor, marginBottom: '1rem' },
    actionButtons: { display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' as const },
    editButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', borderRadius: '8px', textDecoration: 'none' },
    deleteButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#ef4444', color: 'white', borderRadius: '8px', textDecoration: 'none' },
    testButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#4a90c4', color: 'white', borderRadius: '8px', textDecoration: 'none' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '0.75rem', borderBottom: `1px solid ${themeStyles.borderColor}`, color: themeStyles.secondaryText, fontWeight: '600' },
    td: { padding: '0.75rem', borderBottom: `1px solid ${themeStyles.borderColor}`, color: themeStyles.textColor },
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  }

  if (!alumno) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Alumno no encontrado</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/alumnos" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>{alumno.name}</h1>
      </div>

      <div style={styles.card}>
        <p><strong>Email:</strong> {alumno.email}</p>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{alumno.evaluations?.length || 0}</div>
            <div style={styles.statLabel}>Total Evaluaciones</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{alumno.appointments?.length || 0}</div>
            <div style={styles.statLabel}>Total Citas</div>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <Link href={`/alumnos/${id}/editar`} style={styles.editButton}>
            <FaEdit /> Editar
          </Link>
          <Link href={`/alumnos/${id}/eliminar`} style={styles.deleteButton}>
            <FaTrash /> Eliminar
          </Link>
          <Link href={`/test-resultados/${id}`} style={styles.testButton}>
            <FaBrain /> Ver Resultados Test
          </Link>
        </div>
      </div>

      {/* Sección de evaluaciones */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📋 Historial de Evaluaciones</h3>
        {alumno.evaluations?.length === 0 ? (
          <p>No hay evaluaciones registradas</p>
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
              {alumno.evaluations?.map((evalucion: any) => (
                <tr key={evalucion.id}>
                  <td style={styles.td}>{new Date(evalucion.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>{evalucion.score}</td>
                  <td style={styles.td}>{evalucion.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Sección de citas */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📅 Historial de Citas</h3>
        {alumno.appointments?.length === 0 ? (
          <p>No hay citas registradas</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Hora</th>
              </tr>
            </thead>
            <tbody>
              {alumno.appointments?.map((cita: any) => (
                <tr key={cita.id}>
                  <td style={styles.td}>{new Date(cita.date).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(cita.date).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}