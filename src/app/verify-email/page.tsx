"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Token de verificación no encontrado");
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("¡Cuenta verificada exitosamente!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Error al verificar la cuenta");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error de conexión");
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '100px auto',
      padding: '2rem',
      textAlign: 'center' as const,
      background: 'var(--card-bg)',
      borderRadius: '20px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border-color)',
    },
    title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-color)' },
    message: { marginBottom: '2rem', color: 'var(--secondary-text)' },
    loadingSpinner: { display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' },
    button: { display: 'inline-block', padding: '0.8rem 1.5rem', background: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '8px' },
  };

  return (
    <div style={styles.container}>
      {status === "loading" && (
        <>
          <div style={styles.loadingSpinner} />
          <h1 style={styles.title}>Verificando tu cuenta...</h1>
          <p style={styles.message}>Por favor espera un momento</p>
        </>
      )}
      {status === "success" && (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 style={styles.title}>¡Cuenta verificada!</h1>
          <p style={styles.message}>{message}</p>
          <p>Serás redirigido al inicio de sesión...</p>
          <Link href="/login" style={styles.button}>Ir a iniciar sesión</Link>
        </>
      )}
      {status === "error" && (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h1 style={styles.title}>Error de verificación</h1>
          <p style={styles.message}>{message}</p>
          <Link href="/login" style={styles.button}>Volver al inicio</Link>
        </>
      )}
    </div>
  );
}