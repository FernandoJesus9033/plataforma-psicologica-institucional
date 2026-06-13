"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaDownload, FaCalendarAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaStar, FaComment } from "react-icons/fa";

export default function MisActividadesPage() {
  const router = useRouter();
  const [actividades, setActividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/actividades");
        if (res.ok) {
          setActividades(await res.json());
        } else if (res.status === 503) {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  const getStatusInfo = (status: string, dueDate?: string) => {
    if (status === "CALIFICADA") return { text: "Calificada", icon: <FaStar />, color: "#10b981", bg: "#d1fae5" };
    if (status === "COMPLETED") return { text: "Completada", icon: <FaCheckCircle />, color: "#10b981", bg: "#d1fae5" };
    if (dueDate && new Date(dueDate) < new Date()) return { text: "Vencida", icon: <FaHourglassHalf />, color: "#ef4444", bg: "#fee2e2" };
    if (status === "ENTREGADA") return { text: "Entregada", icon: <FaCheckCircle />, color: "#f59e0b", bg: "#fef3c7" };
    return { text: "Pendiente", icon: <FaClock />, color: "#f59e0b", bg: "#fef3c7" };
  };

  const handleCardClick = (id: string) => {
    router.push(`/actividades/${id}`);
  };

  const handleFileClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' },
    cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' },
    cardMeta: { display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', flexWrap: 'wrap' as const },
    description: { fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem', lineHeight: '1.4' },
    fileLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '30px', border: 'none', cursor: 'pointer' },
    feedbackBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#4f46e5', background: '#eef2ff', padding: '0.2rem 0.6rem', borderRadius: '30px', marginTop: '0.5rem' },
    emptyState: { textAlign: 'center' as const, padding: '3rem', color: '#64748b' },
    maintenanceCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center' as const, maxWidth: '500px', margin: '0 auto' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  
  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>📋 Mis Actividades</h1>
        <div style={styles.maintenanceCard}>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem' }}>Próximamente disponible.</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>⚠️ En proceso de migración a Netlify Blobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Mis Actividades</h1>
      {actividades.length === 0 ? (
        <div style={styles.emptyState}>No tienes actividades asignadas</div>
      ) : (
        <div style={styles.grid}>
          {actividades.map(act => {
            const status = getStatusInfo(act.status, act.dueDate);
            return (
              <div key={act.id} style={styles.card} onClick={() => handleCardClick(act.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={styles.cardTitle}>{act.title}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '500', background: status.bg, color: status.color }}>
                    {status.icon} {status.text}
                  </span>
                </div>
                
                <div style={styles.cardMeta}>
                  {act.dueDate && <span><FaCalendarAlt /> {new Date(act.dueDate).toLocaleDateString()}</span>}
                </div>
                
                {act.description && <p style={styles.description}>{act.description}</p>}
                
                {act.fileUrl && (
                  <button 
                    onClick={(e) => handleFileClick(e, act.fileUrl)} 
                    style={{ ...styles.fileLink, background: '#eef2ff', border: 'none', cursor: 'pointer' }}
                  >
                    <FaDownload /> {act.fileName || "Material adjunto"}
                  </button>
                )}

                {act.comentario && (
                  <div style={styles.feedbackBadge}>
                    <FaComment /> Tiene retroalimentación
                  </div>
                )}

                {act.status === "CALIFICADA" && act.calificacion !== null && (
                  <div style={{ ...styles.feedbackBadge, background: '#d1fae5', color: '#10b981' }}>
                    <FaStar /> Calificación: {act.calificacion}/100
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}