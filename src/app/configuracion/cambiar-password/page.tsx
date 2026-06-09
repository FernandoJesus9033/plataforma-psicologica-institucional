"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

export default function CambiarPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMensaje({ texto: "Las nuevas contraseñas no coinciden", tipo: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMensaje({ texto: "La contraseña debe tener al menos 6 caracteres", tipo: "error" });
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/configuracion/cambiar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: "✅ Contraseña actualizada correctamente", tipo: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => router.push("/configuracion"), 2000);
      } else {
        setMensaje({ texto: data.error || "Error al cambiar contraseña", tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    formGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', fontWeight: '500', color: '#1e293b', marginBottom: '0.3rem' },
    passwordContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    input: { flex: 1, padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
    eyeButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#64748b' },
    button: { width: '100%', padding: '0.8rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    successMessage: { background: '#d1fae5', color: '#065f46', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' },
    errorMessage: { background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/configuracion" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>Cambiar Contraseña</h1>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {mensaje && (
            <div style={mensaje.tipo === "success" ? styles.successMessage : styles.errorMessage}>
              {mensaje.texto}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña actual</label>
            <div style={styles.passwordContainer}>
              <input
                type={showCurrent ? "text" : "password"}
                style={styles.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button type="button" style={styles.eyeButton} onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nueva contraseña</label>
            <div style={styles.passwordContainer}>
              <input
                type={showNew ? "text" : "password"}
                style={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <button type="button" style={styles.eyeButton} onClick={() => setShowNew(!showNew)}>
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar nueva contraseña</label>
            <div style={styles.passwordContainer}>
              <input
                type={showNew ? "text" : "password"}
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            <FaSave /> {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}