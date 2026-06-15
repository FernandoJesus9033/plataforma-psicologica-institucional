"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSave, FaTimes, FaArrowLeft, FaSpinner } from "react-icons/fa";

export default function EditarAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [formData, setFormData] = useState({ name: "", email: "", matricula: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔄 Cargando alumno para editar:", id);
        const res = await fetch(`/api/alumnos/${id}`);
        
        if (res.ok) {
          const alumno = await res.json();
          console.log("✅ Alumno cargado:", alumno);
          setFormData({
            name: alumno.name || "",
            email: alumno.email || "",
            matricula: alumno.matricula || ""
          });
        } else {
          setError("Error al cargar el alumno");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      console.log("✏️ Actualizando alumno:", id, formData);
      const res = await fetch(`/api/alumnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        console.log("✅ Alumno actualizado");
        router.push(`/alumnos/${id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Error al actualizar");
        setSaving(false);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error de conexión");
      setSaving(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' as const },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#2c3e50', margin: 0 },
    card: { background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontWeight: '500', color: '#2c3e50', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem' },
    errorMessage: { background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem' },
    buttonGroup: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    saveButton: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' },
    cancelButton: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.75rem', background: '#e2e8f0', color: '#475569', textDecoration: 'none', borderRadius: '10px', textAlign: 'center' as const }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <FaSpinner className="animate-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
        <p>Cargando alumno...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href={`/alumnos/${id}`} style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>Editar Alumno</h1>
      </div>

      <div style={styles.card}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        
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
            <label style={styles.label}>Matrícula</label>
            <input 
              type="text" 
              style={styles.input} 
              value={formData.matricula} 
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} 
              placeholder="Opcional - Ej: 2024001"
            />
            <small style={{ color: '#64748b', fontSize: '0.7rem' }}>Campo opcional para identificación del alumno</small>
          </div>

          <div style={styles.buttonGroup}>
            <Link href={`/alumnos/${id}`} style={styles.cancelButton}>
              <FaTimes /> Cancelar
            </Link>
            <button type="submit" style={styles.saveButton} disabled={saving}>
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} 
              {saving ? "Guardando..." : "Actualizar"}
            </button>
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