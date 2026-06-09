"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function CambiarPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Aquí iría la lógica para cambiar la contraseña
    setSuccess(true);
    setTimeout(() => {
      router.push("/configuracion");
    }, 2000);
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
    <Layout session={null}>
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

            <button type="submit" style={styles.button}>
              Actualizar Contraseña
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