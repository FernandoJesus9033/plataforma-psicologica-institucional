"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function CambiarPasswordPage() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/configuracion/cambiar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/configuracion");
        }, 2000);
      } else {
        setError(data.error || "Error al cambiar la contraseña");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '2rem',
    },
    card: {
      background: 'white',
      borderRadius: '15px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1.5rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '1rem',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginBottom: '1rem',
    },
    buttonDisabled: {
      width: '100%',
      padding: '1rem',
      background: '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'not-allowed',
      marginBottom: '1rem',
    },
    error: {
      color: '#dc3545',
      marginBottom: '1rem',
    },
    success: {
      color: '#28a745',
      marginBottom: '1rem',
    },
    backLink: {
      display: 'block',
      textAlign: 'center' as const,
      color: '#667eea',
      textDecoration: 'none',
    },
  };

  return (
    <Layout>  {/* ✅ Eliminado session={null} */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Cambiar Contraseña</h1>
          
          {error && <div style={styles.error}>{error}</div>}
          {success && (
            <div style={styles.success}>
              Contraseña actualizada correctamente. Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contraseña actual</label>
              <input
                type="password"
                style={styles.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nueva contraseña</label>
              <input
                type="password"
                style={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirmar nueva contraseña</label>
              <input
                type="password"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              style={loading ? styles.buttonDisabled : styles.button}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>

            <Link href="/configuracion" style={styles.backLink}>
              ← Volver a Configuración
            </Link>
          </form>
        </div>
      </div>
    </Layout>
  );
}