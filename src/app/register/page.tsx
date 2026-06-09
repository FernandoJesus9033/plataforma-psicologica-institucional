"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaHome, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("STUDENT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      setError("Error de conexión");
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
    select: {
      width: '100%',
      padding: '0.5rem 1rem',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      fontSize: '1rem',
      background: '#fafafa',
      color: '#2c3e50',
      outline: 'none',
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
    link: {
      color: '#4a90c4',
      textDecoration: 'none',
      fontWeight: '500',
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

        <h1 style={styles.title}>Crear cuenta</h1>
        <p style={styles.subtitle}>Regístrate para acceder a la plataforma</p>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre completo</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>
          </div>

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

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de usuario</label>
            <select style={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="STUDENT">Estudiante</option>
              <option value="PSYCHOLOGIST">Psicóloga</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"} <FaArrowRight />
          </button>
        </form>

        <div style={styles.footer}>
          ¿Ya tienes cuenta? <Link href="/login" style={styles.link}>Inicia sesión aquí</Link>
          <br />
          <Link href="/" style={styles.backLink}>
            <FaHome size={12} /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}