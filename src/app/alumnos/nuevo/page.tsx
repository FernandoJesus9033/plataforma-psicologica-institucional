"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";

export default function NuevoAlumnoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", matricula: "", password: "123456" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (session?.user?.role !== "PSYCHOLOGIST") {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/alumnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/alumnos");
      } else {
        setError(data.error || "Error al crear alumno");
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b', marginBottom: '2rem' },
    card: { background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontWeight: '500', color: '#1e293b', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
    errorBox: { background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' },
    buttonGroup: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    saveButton: { padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    cancelButton: { padding: '0.6rem 1.2rem', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '40px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '1.5rem' }
  };

  return (
    <div style={styles.container}>
      <Link href="/alumnos" style={styles.backLink}>
        <FaArrowLeft /> Volver a Alumnos
      </Link>
      <h1 style={styles.title}>Nuevo Alumno</h1>
      <p style={styles.subtitle}>Agrega un nuevo alumno al sistema</p>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre completo *</label>
            <input
              type="text"
              style={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Juan Pérez González"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Correo electrónico *</label>
            <input
              type="email"
              style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="ejemplo@institucion.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Matrícula (opcional)</label>
            <input
              type="text"
              style={styles.input}
              value={formData.matricula}
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
              placeholder="Ej: 2024001"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña inicial</label>
            <input
              type="text"
              style={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="123456"
            />
            <small style={{ color: '#64748b', fontSize: '0.7rem' }}>El alumno podrá cambiarla después</small>
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton} disabled={loading}>
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} Guardar Alumno
            </button>
            <Link href="/alumnos" style={styles.cancelButton}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}