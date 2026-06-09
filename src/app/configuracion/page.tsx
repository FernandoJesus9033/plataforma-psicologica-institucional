"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCog, FaKey, FaPalette, FaArrowRight, FaFileExcel } from "react-icons/fa";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function ConfiguracionPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setSession(data);
      setLoading(false);
    };
    loadSession();
  }, [router]);

  const isPsychologist = session?.user?.role === "PSYCHOLOGIST";

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', transition: 'all 0.2s' },
    cardIcon: { fontSize: '2rem', marginBottom: '1rem', color: '#4f46e5' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
    cardDesc: { fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' },
    cardLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <FaCog /> Configuración
      </h1>

      <div style={styles.grid}>
        {/* Test Base - solo para psicóloga */}
        {isPsychologist && (
          <Link href="/configuracion/test-base" style={{ textDecoration: 'none' }}>
            <div style={styles.card}>
              <div style={styles.cardIcon}><FaFileExcel /></div>
              <h3 style={styles.cardTitle}>Test Base</h3>
              <p style={styles.cardDesc}>Sube el archivo Excel que los alumnos deberán completar</p>
              <span style={styles.cardLink}>Configurar <FaArrowRight size={12} /></span>
            </div>
          </Link>
        )}

        {/* Cambiar Contraseña - disponible para todos */}
        <Link href="/configuracion/cambiar-password" style={{ textDecoration: 'none' }}>
          <div style={styles.card}>
            <div style={styles.cardIcon}><FaKey /></div>
            <h3 style={styles.cardTitle}>Cambiar Contraseña</h3>
            <p style={styles.cardDesc}>Actualiza tu contraseña de acceso</p>
            <span style={styles.cardLink}>Configurar <FaArrowRight size={12} /></span>
          </div>
        </Link>

        {/* Apariencia - disponible para todos con selector de 3 opciones */}
        <div style={styles.card}>
          <div style={styles.cardIcon}><FaPalette /></div>
          <h3 style={styles.cardTitle}>Apariencia</h3>
          <p style={styles.cardDesc}>Cambiar tema (Claro / Oscuro / Sistema)</p>
          <div style={{ marginTop: '0.5rem' }}>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}