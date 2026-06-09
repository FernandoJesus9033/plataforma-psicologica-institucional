"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

export default function EliminarEvaluacionPage({ params }: { params: { id: string } }) {
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/evaluations/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setStudentName(data.student.name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    const res = await fetch(`/api/evaluations/${params.id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      router.push("/evaluaciones");
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
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
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '2.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
      textAlign: 'center' as const,
    },
    icon: {
      fontSize: '4rem',
      color: '#ef4444',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '1rem',
    },
    message: {
      color: '#64748b',
      marginBottom: '2rem',
      lineHeight: '1.6',
    },
    studentName: {
      fontWeight: '600',
      color: '#ef4444',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
    },
    deleteButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      justifyContent: 'center',
    },
    cancelButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      background: '#f1f5f9',
      color: '#64748b',
      textDecoration: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '500',
      justifyContent: 'center',
    },
  };

  if (loading) {
    return (
      <Layout session={null}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout session={null}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href={`/evaluaciones/${params.id}`} style={styles.backButton}>
            <FaArrowLeft /> Volver
          </Link>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>
          <h1 style={styles.title}>Confirmar Eliminación</h1>
          <p style={styles.message}>
            ¿Estás seguro de que deseas eliminar la evaluación de <br />
            <span style={styles.studentName}>{studentName}</span>?
          </p>

          <div style={styles.buttonGroup}>
            <button onClick={handleDelete} style={styles.deleteButton}>
              <FaTrash /> Sí, eliminar
            </button>
            <Link href={`/evaluaciones/${params.id}`} style={styles.cancelButton}>
              Cancelar
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}