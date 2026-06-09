"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaArrowRight, FaHome, FaArrowLeft, FaSpinner } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: data.message || "Revisa tu correo para restablecer tu contraseña", tipo: "success" });
        setEmail("");
      } else {
        setMensaje({ texto: data.error || "Error al enviar el correo", tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión", tipo: "error" });
    } finally {
      setLoading(false);
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
      maxWidth: '480px',
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
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '0.5rem',
      textAlign: 'center' as const,
    },
    subtitle: {
      color: '#7f8c8d',
      textAlign: 'center' as const,
      marginBottom: '2rem',
      fontSize: '0.9rem',
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
    button: {
      width: '100%',
      padding: '1rem',
      background: '#4a90c4',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    successMessage: {
      background: '#d1fae5',
      color: '#065f46',
      padding: '0.8rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      textAlign: 'center' as const,
      fontSize: '0.9rem',
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
    footer: {
      marginTop: '1.5rem',
      textAlign: 'center' as const,
      color: '#7f8c8d',
      fontSize: '0.9rem',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '1rem',
      color: '#7f8c8d',
      textDecoration: 'none',
      fontSize: '0.85rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🧠</div>
          <div style={styles.logoText}>Plataforma Psicológica</div>
          <div style={styles.logoSlogan}>Bienestar y crecimiento emocional</div>
        </div>

        <h1 style={styles.title}>¿Olvidaste tu contraseña?</h1>
        <p style={styles.subtitle}>Ingresa tu correo y te enviaremos un enlace para restablecerla</p>

        <form onSubmit={handleSubmit}>
          {mensaje && (
            <div style={mensaje.tipo === "success" ? styles.successMessage : styles.errorMessage}>
              {mensaje.texto}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaArrowRight />}
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link href="/login" style={styles.backLink}>
            <FaArrowLeft size={12} /> Volver al inicio de sesión
          </Link>
          <br />
          <Link href="/" style={styles.backLink}>
            <FaHome size={12} /> Volver al inicio
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}