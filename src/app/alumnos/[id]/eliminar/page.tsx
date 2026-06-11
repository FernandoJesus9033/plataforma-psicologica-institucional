"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTrash, FaTimes, FaArrowLeft } from "react-icons/fa";

export default function EliminarAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`/api/alumnos/${id}`);
      if (res.ok) {
        const alumno = await res.json();
        setStudentName(alumno.name);
      } else {
        setError("Error al cargar el alumno");
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/alumnos");
      } else {
        const data = await res.json();
        setError(data.error || "Error al eliminar");
        setDeleting(false);
      }
    } catch (err) {
      setError("Error de conexión");
      setDeleting(false);
    }
  };

  const styles = {
    container: { maxWidth: '500px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#2c3e50', margin: 0 },
    card: { background: 'white', borderRadius: '20px', padding: '2rem', textAlign: 'center', border: '1px solid #e2e8f0' },
    icon: { fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' },
    studentName: { fontWeight: 'bold', color: '#ef4444' },
    buttonGroup: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    deleteButton: { flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer' },
    cancelButton: { flex: 1, background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' },
    errorMessage: { background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem' },
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/alumnos" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>Eliminar Alumno</h1>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <div style={styles.icon}>⚠️</div>
        <h2>¿Estás seguro?</h2>
        <p>Estás a punto de eliminar a <span style={styles.studentName}>{studentName}</span></p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#64748b' }}>Todas las evaluaciones y citas asociadas también se eliminarán.</p>
        <div style={styles.buttonGroup}>
          <button onClick={handleDelete} style={styles.deleteButton} disabled={deleting}>
            <FaTrash /> {deleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <Link href="/alumnos" style={styles.cancelButton}>
            <FaTimes /> Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}