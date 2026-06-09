"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaComment, FaCheckCircle, FaTimesCircle, FaSpinner, FaTrash, FaCheck } from "react-icons/fa";
import ModalConfirmacion from "@/components/ModalConfirmacion";
import ToastNotificacion from "@/components/ToastNotificacion";

interface Cita {
  id: string;
  date: string;
  motivo: string | null;
  status: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AgendaPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: () => {} });
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" as "success" | "error" | "info" });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isOpen: true, message, type });
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const res = await fetch("/api/citas");
      if (res.ok) {
        const data = await res.json();
        setCitas(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarCita = (id: string) => {
    setModalConfig({
      title: "Confirmar cita",
      message: "¿Estás seguro de que deseas confirmar esta cita? El alumno recibirá una notificación.",
      onConfirm: () => handleConfirmar(id)
    });
    setModalOpen(true);
  };

  const cancelarCita = (id: string) => {
    setModalConfig({
      title: "Cancelar cita",
      message: "¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.",
      onConfirm: () => handleCancelar(id)
    });
    setModalOpen(true);
  };

  const handleConfirmar = async (id: string) => {
    setProcesando(id);
    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONFIRMED" })
      });
      if (res.ok) {
        showToast("Cita confirmada correctamente", "success");
        cargarCitas();
      } else {
        showToast("Error al confirmar la cita", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setProcesando(null);
      setModalOpen(false);
    }
  };

  const handleCancelar = async (id: string) => {
    setProcesando(id);
    try {
      const res = await fetch(`/api/citas/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Cita cancelada correctamente", "success");
        cargarCitas();
      } else {
        showToast("Error al cancelar la cita", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setProcesando(null);
      setModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return { text: "Confirmada", color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle /> };
      case "CANCELLED":
        return { text: "Cancelada", color: "#ef4444", bg: "#fee2e2", icon: <FaTimesCircle /> };
      default:
        return { text: "Pendiente", color: "#f59e0b", bg: "#fef3c7", icon: <FaClock /> };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fecha: date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      hora: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    subtitle: { color: '#64748b', fontSize: '0.9rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: 'white', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' as const, transition: 'all 0.2s' },
    statNumber: { fontSize: '2rem', fontWeight: '700', color: '#4f46e5' },
    statLabel: { fontSize: '0.8rem', color: '#64748b' },
    citasGrid: { display: 'grid', gap: '1rem' },
    citaCard: { background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    citaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '0.5rem', marginBottom: '0.75rem' },
    citaFecha: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#1e293b' },
    citaHora: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4f46e5', fontWeight: '500' },
    citaAlumno: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' },
    citaMotivo: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '12px' },
    buttonGroup: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
    confirmButton: { display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.8rem' },
    cancelButton: { display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 1rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.8rem' },
    emptyState: { textAlign: 'center' as const, padding: '3rem', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', color: '#64748b' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando citas...</div>;
  }

  const pendientes = citas.filter(c => c.status === "PENDING").length;
  const confirmadas = citas.filter(c => c.status === "CONFIRMED").length;
  const hoy = citas.filter(c => new Date(c.date).toDateString() === new Date().toDateString()).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaCalendarAlt style={{ color: '#4f46e5' }} /> Agenda de Citas
        </h1>
        <p style={styles.subtitle}>Gestiona las solicitudes de cita de los alumnos</p>
      </div>

      {/* Estadísticas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{citas.length}</div>
          <div style={styles.statLabel}>Total de citas</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{pendientes}</div>
          <div style={styles.statLabel}>Pendientes</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{confirmadas}</div>
          <div style={styles.statLabel}>Confirmadas</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{hoy}</div>
          <div style={styles.statLabel}>Citas para hoy</div>
        </div>
      </div>

      {/* Lista de citas */}
      {citas.length === 0 ? (
        <div style={styles.emptyState}>
          <FaCalendarAlt style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
          <p>No hay citas solicitadas</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Los alumnos solicitarán citas desde su panel.</p>
        </div>
      ) : (
        <div style={styles.citasGrid}>
          {citas.map((cita) => {
            const { fecha, hora } = formatDate(cita.date);
            const status = getStatusBadge(cita.status);
            return (
              <div key={cita.id} style={styles.citaCard}>
                <div style={styles.citaHeader}>
                  <div style={styles.citaFecha}>
                    <FaCalendarAlt size={14} /> {fecha}
                  </div>
                  <div style={styles.citaHora}>
                    <FaClock size={14} /> {hora}
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '500', background: status.bg, color: status.color }}>
                    {status.icon} {status.text}
                  </span>
                </div>
                <div style={styles.citaAlumno}>
                  <FaUser size={14} /> {cita.student.name} ({cita.student.email})
                </div>
                {cita.motivo && (
                  <div style={styles.citaMotivo}>
                    <FaComment size={14} style={{ marginTop: '2px' }} />
                    <span>{cita.motivo}</span>
                  </div>
                )}
                {cita.status === "PENDING" && (
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => confirmarCita(cita.id)}
                      style={styles.confirmButton}
                      disabled={procesando === cita.id}
                    >
                      {procesando === cita.id ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaCheck />}
                      Confirmar
                    </button>
                    <button
                      onClick={() => cancelarCita(cita.id)}
                      style={styles.cancelButton}
                      disabled={procesando === cita.id}
                    >
                      <FaTrash /> Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Toast de notificación */}
      <ToastNotificacion
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}