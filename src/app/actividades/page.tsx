"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaDownload, FaCalendarAlt, FaUser, FaClock, FaCheckCircle, FaHourglassHalf, FaTrash, FaEdit } from "react-icons/fa";
import ModalConfirmacion from "@/components/ModalConfirmacion";
import ToastNotificacion from "@/components/ToastNotificacion";

export default function ActividadesPage() {
  const router = useRouter();
  const [actividades, setActividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actividadAEliminar, setActividadAEliminar] = useState<string | null>(null);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" as "success" | "error" | "info" });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isOpen: true, message, type });
  };

  useEffect(() => {
    loadActividades();
  }, []);

  const loadActividades = async () => {
    const res = await fetch("/api/actividades");
    if (res.ok) {
      const data = await res.json();
      setActividades(data);
    }
    setLoading(false);
  };

  const getStatusInfo = (status: string, dueDate?: string) => {
    if (status === "COMPLETED") return { text: "Completada", icon: <FaCheckCircle />, color: "#10b981", bg: "#d1fae5" };
    if (dueDate && new Date(dueDate) < new Date()) return { text: "Vencida", icon: <FaHourglassHalf />, color: "#ef4444", bg: "#fee2e2" };
    if (status === "PENDING_REVIEW") return { text: "En revisión", icon: <FaClock />, color: "#f59e0b", bg: "#fef3c7" };
    return { text: "Pendiente", icon: <FaClock />, color: "#f59e0b", bg: "#fef3c7" };
  };

  const handleEliminarClick = (id: string) => {
    setActividadAEliminar(id);
    setModalOpen(true);
  };

  const handleConfirmEliminar = async () => {
    if (!actividadAEliminar) return;

    try {
      const res = await fetch(`/api/actividades/${actividadAEliminar}`, {
        method: "DELETE"
      });

      if (res.ok) {
        showToast("Actividad eliminada correctamente", "success");
        loadActividades();
      } else {
        showToast("Error al eliminar la actividad", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setModalOpen(false);
      setActividadAEliminar(null);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/actividades/${id}`);
  };

  const handleFileClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    newButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', borderRadius: '40px', textDecoration: 'none', fontSize: '0.9rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' as const },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
    cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0, flex: 1 },
    deleteButton: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.3rem', borderRadius: '8px', transition: 'all 0.2s' },
    cardMeta: { display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', flexWrap: 'wrap' as const },
    description: { fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: '1.4' },
    fileLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '30px', border: 'none', cursor: 'pointer' },
    emptyState: { textAlign: 'center' as const, padding: '3rem', color: '#64748b' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Actividades</h1>
        <Link href="/actividades/nueva" style={styles.newButton}>
          <FaPlus /> Nueva Actividad
        </Link>
      </div>

      {actividades.length === 0 ? (
        <div style={styles.emptyState}>No hay actividades creadas</div>
      ) : (
        <div style={styles.grid}>
          {actividades.map(act => {
            const status = getStatusInfo(act.status, act.dueDate);
            return (
              <div key={act.id} style={styles.card} onClick={() => handleCardClick(act.id)}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{act.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarClick(act.id);
                    }}
                    style={styles.deleteButton}
                    title="Eliminar actividad"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div style={styles.cardMeta}>
                  <span><FaUser /> {act.student?.name}</span>
                  {act.dueDate && <span><FaCalendarAlt /> {new Date(act.dueDate).toLocaleDateString()}</span>}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '500', background: status.bg, color: status.color }}>
                    {status.icon} {status.text}
                  </span>
                </div>
                {act.description && <p style={styles.description}>{act.description}</p>}
                {act.fileUrl && (
                  <button
                    onClick={(e) => handleFileClick(e, act.fileUrl)}
                    style={styles.fileLink}
                  >
                    <FaDownload /> {act.fileName || "Adjunto"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmEliminar}
        title="Eliminar actividad"
        message="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer y se eliminarán también los archivos asociados."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      <ToastNotificacion
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}