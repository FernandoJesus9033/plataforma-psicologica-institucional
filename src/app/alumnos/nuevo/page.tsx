"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { FaSave, FaTimes, FaUserPlus, FaArrowLeft } from "react-icons/fa";

export default function NuevoAlumnoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { themeStyles } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    if (res.ok) {
      router.push("/alumnos");
    } else {
      const data = await res.json();
      setError(data.error || "Error al crear alumno");
      setSaving(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    header: { marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: themeStyles.textColor, margin: 0 },
    subtitle: { color: themeStyles.secondaryText, marginBottom: '1.5rem' },
    card: { background: themeStyles.cardBg, borderRadius: '20px', padding: '2rem', border: `1px solid ${themeStyles.borderColor}`, boxShadow: themeStyles.shadow },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', marginBottom: '0.5rem', color: themeStyles.textColor, fontWeight: '500' },
    input: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: `1px solid ${themeStyles.borderColor}`, background: themeStyles.inputBg, color: themeStyles.inputText, fontSize: '1rem' },
    buttonGroup: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    saveButton: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.8rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' },
    cancelButton: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.8rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' },
    errorMessage: { background: '#ef444420', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/alumnos" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}><FaUserPlus /> Nuevo Alumno</h1>
      </div>
      <p style={styles.subtitle}>Agrega un nuevo alumno al sistema</p>

      <div style={styles.card}>
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre completo</label>
            <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej: Juan Pérez" />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ejemplo@correo.com" />
          </div>

          <div style={styles.buttonGroup}>
            <Link href="/alumnos" style={styles.cancelButton}>
              <FaTimes /> Cancelar
            </Link>
            <button type="submit" style={styles.saveButton} disabled={saving}>
              <FaSave /> {saving ? "Guardando..." : "Guardar Alumno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}