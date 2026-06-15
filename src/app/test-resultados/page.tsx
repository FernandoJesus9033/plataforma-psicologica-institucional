"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaFileExcel, FaDownload, FaChartLine, FaSpinner, FaSyncAlt } from "react-icons/fa";

interface Resultado {
  id: string;
  studentName: string;
  studentEmail: string;
  archivoNombre: string;
  fecha: string;
  procesado: boolean;
}

export default function TestResultadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.role === "PSYCHOLOGIST") {
      cargarResultados();
    } else if (session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const cargarResultados = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔄 Cargando resultados...");
      const res = await fetch("/api/test-resultados");
      console.log("📡 Status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📋 Resultados cargados:", data);
        console.log("📊 Cantidad:", data.length);
        setResultados(data);
      } else if (res.status === 403) {
        const errorData = await res.json();
        setError(errorData.error || "No tienes permiso para ver esta página");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Error al cargar los resultados");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '1rem' },
    titleSection: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' },
    refreshButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.8rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse' as const, overflowX: 'auto' as const, display: 'block' as const },
    th: { textAlign: 'left' as const, padding: '1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '600', background: '#f8fafc' },
    td: { padding: '1rem', borderBottom: '1px solid #e2e8f0', color: '#2c3e50' },
    downloadButton: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#4a90c4', color: 'white', borderRadius: '20px', textDecoration: 'none', fontSize: '0.8rem', border: 'none', cursor: 'pointer' },
    archivoBadge: (tiene: boolean) => ({
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '500',
      background: tiene ? '#d1fae5' : '#fef3c7', color: tiene ? '#065f46' : '#d97706'
    }),
    emptyState: { textAlign: 'center' as const, padding: '3rem', color: '#64748b' },
    loadingState: { textAlign: 'center' as const, padding: '4rem', color: '#64748b' },
    errorState: { textAlign: 'center' as const, padding: '3rem', color: '#dc2626', background: '#fee2e2', borderRadius: '16px' },
    debugInfo: { background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace' }
  };

  if (status === "loading" || loading) {
    return (
      <div style={styles.loadingState}>
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto" />
        <p className="mt-2">Cargando resultados...</p>
      </div>
    );
  }

  if (session?.user?.role !== "PSYCHOLOGIST") {
    return (
      <div style={styles.loadingState}>
        <p>Acceso no autorizado. Solo psicólogos pueden ver esta página.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.titleSection}>
            <FaChartLine style={{ color: '#4a90c4', fontSize: '1.8rem' }} />
            <h1 style={styles.title}>Resultados del Test P-IPG</h1>
          </div>
          <p style={styles.subtitle}>Revisa los test completados por los alumnos</p>
        </div>
        <button onClick={cargarResultados} style={styles.refreshButton} disabled={loading}>
          <FaSyncAlt /> {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {/* Debug info */}
      <div style={styles.debugInfo}>
        🔍 Debug: {resultados.length} resultados cargados desde la API
      </div>

      <div style={styles.card}>
        {error ? (
          <div style={styles.errorState}>
            <p>{error}</p>
            <button 
              onClick={cargarResultados} 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        ) : resultados.length === 0 ? (
          <div style={styles.emptyState}>
            <FaFileExcel style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
            <p>No hay resultados registrados aún.</p>
            <p>Los alumnos deben subir su test completado.</p>
            <button 
              onClick={cargarResultados} 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Buscar resultados
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Estudiante</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Archivo</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}><strong>{r.studentName}</strong></td>
                    <td style={styles.td}>{r.studentEmail}</td>
                    <td style={styles.td}>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span style={styles.archivoBadge(!!r.archivoNombre)}>
                        <FaFileExcel size={12} />
                        {r.archivoNombre ? "Subido" : "Pendiente"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {r.archivoNombre ? (
                        <a href={`/api/archivos/${encodeURIComponent(r.archivoNombre)}`} download style={styles.downloadButton}>
                          <FaDownload /> Descargar
                        </a>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>No disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}