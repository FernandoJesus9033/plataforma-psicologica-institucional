"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaLock, FaArrowRight, FaHome, FaArrowLeft, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

// Componente interno que usa useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setMensaje({ texto: "Token inválido o expirado", tipo: "error" });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMensaje({ texto: "Las contraseñas no coinciden", tipo: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMensaje({ texto: "La contraseña debe tener al menos 6 caracteres", tipo: "error" });
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: "✅ Contraseña actualizada correctamente. Redirigiendo al login...", tipo: "success" });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMensaje({ texto: data.error || "Error al restablecer la contraseña", tipo: "error" });
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
    eyeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4a90c4',
      display: 'flex',
      alignItems: 'center',
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

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🧠</div>
            <div style={styles.logoText}>Plataforma Psicológica</div>
            <div style={styles.logoSlogan}>Bienestar y crecimiento emocional</div>
          </div>
          <h1 style={styles.title}>Enlace inválido</h1>
          <p style={styles.subtitle}>El enlace de restablecimiento no es válido o ya expiró.</p>
          <Link href="/forgot-password" style={{ ...styles.button, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Solicitar nuevo enlace
          </Link>
          <div style={styles.footer}>
            <Link href="/" style={styles.backLink}>
              <FaHome size={12} /> Volver al inicio
            </Link>
          </div>
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

        <h1 style={styles.title}>Restablecer contraseña</h1>
        <p style={styles.subtitle}>Ingresa tu nueva contraseña</p>

        <form onSubmit={handleSubmit}>
          {mensaje && (
            <div style={mensaje.tipo === "success" ? styles.successMessage : styles.errorMessage}>
              {mensaje.texto}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Nueva contraseña</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                style={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" style={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar contraseña</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input
                type="password"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaArrowRight />}
            {loading ? "Guardando..." : "Restablecer contraseña"}
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

// Componente principal con Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}