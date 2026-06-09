"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSave, FaTimes, FaChartLine, FaUserGraduate } from "react-icons/fa";

export default function EditarEvaluacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [score, setScore] = useState("");
  const [status, setStatus] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/evaluations/${id}`)
      .then(res => res.json())
      .then(data => {
        setScore(data.score.toString());
        setStatus(data.status);
        setStudentName(data.student.name);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar evaluación");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/evaluations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: parseInt(score), status })
      });
      if (res.ok) {
        router.push("/evaluaciones");
      } else {
        const data = await res.json();
        setError(data.error || "Error al actualizar");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f0fe 0%, #d9e6f5 100%)',
      padding: '1rem',
    },
    card: {
      maxWidth: '520px',
      width: '100%',
      background: 'white',
      borderRadius: '32px',
      padding: '2.5rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    },
    logo: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    logoIcon: {
      fontSize: '3rem',
      color: '#4a90c4',
      marginBottom: '0.5rem',
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '0.25rem',
    },
    logoSlogan: {
      fontSize: '0.85rem',
      color: '#7f8c8d',
    },
    title: {
      fontSize: '1.6rem',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '0.5rem',
      textAlign: 'center' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    subtitle: {
      color: '#7f8c8d',
      textAlign: 'center' as const,
      marginBottom: '2rem',
      fontSize: '0.9rem',
    },
    studentInfo: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '1rem 1.2rem',
      marginBottom: '1.5rem',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    studentIcon: {
      fontSize: '2rem',
      color: '#4a90c4',
    },
    studentText: {
      flex: 1,
    },
    studentLabel: {
      fontSize: '0.7rem',
      color: '#64748b',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    studentName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#2c3e50',
      fontWeight: '500',
      fontSize: '0.9rem',
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '0.5rem 1rem',
      transition: 'all 0.3s',
      background: '#fafafa',
    },
    inputIcon: {
      color: '#4a90c4',
      marginRight: '0.75rem',
      fontSize: '1rem',
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: '1rem',
      padding: '0.5rem 0',
      color: '#2c3e50',
    },
    select: {
      width: '100%',
      padding: '0.8rem 1rem',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      background: '#fafafa',
      fontSize: '1rem',
      color: '#2c3e50',
      cursor: 'pointer',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    saveButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.9rem',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    cancelButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.9rem',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '0.8rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      textAlign: 'center' as const,
      fontSize: '0.9rem',
    },
  };

  const statusOptions = [
    { value: "GREEN", label: "🟢 Verde - Estable", color: "#10b981" },
    { value: "YELLOW", label: "🟡 Amarillo - En observación", color: "#f59e0b" },
    { value: "RED", label: "🔴 Rojo - Requiere atención", color: "#ef4444" },
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🧠</div>
            <div style={styles.logoText}>Plataforma Psicológica</div>
            <div style={styles.logoSlogan}>Bienestar y crecimiento emocional</div>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🧠</div>
          <div style={styles.logoText}>Plataforma Psicológica</div>
          <div style={styles.logoSlogan}>Bienestar y crecimiento emocional</div>
        </div>

        <h1 style={styles.title}>
          <FaChartLine /> Editar Evaluación
        </h1>
        <p style={styles.subtitle}>Modifica el puntaje y estado de la evaluación</p>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.studentInfo}>
          <div style={styles.studentIcon}>👤</div>
          <div style={styles.studentText}>
            <div style={styles.studentLabel}>Alumno</div>
            <div style={styles.studentName}>{studentName}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>📊 Puntaje (0-100)</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🎯</span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                style={styles.input}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🎨 Estado Psicológico</label>
            <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ color: opt.color }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton} disabled={saving}>
              <FaSave /> {saving ? "Guardando..." : "Actualizar"}
            </button>
            <Link href="/evaluaciones" style={styles.cancelButton}>
              <FaTimes /> Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}