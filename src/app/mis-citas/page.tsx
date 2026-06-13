"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaClock, FaComment, FaPaperPlane, FaTrash, FaCheckCircle } from "react-icons/fa";

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
}

export default function MisCitasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [solicitando, setSolicitando] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user) {
      cargarCitas();
    }
  }, [status, session, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSolicitando(true);
    setError("");
    setExito("");

    if (!fecha || !hora) {
      setError("Por favor selecciona una fecha y hora");
      setSolicitando(false);
      return;
    }

    const fechaHora = new Date(`${fecha}T${hora}`);
    if (fechaHora < new Date()) {
      setError("No puedes agendar una cita en el pasado");
      setSolicitando(false);
      return;
    }

    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: fechaHora.toISOString(),
          motivo: motivo || "Sin motivo especificado"
        })
      });

      if (res.ok) {
        setExito("¡Cita solicitada correctamente!");
        setFecha("");
        setHora("");
        setMotivo("");
        cargarCitas();
        setTimeout(() => setExito(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al solicitar cita");
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión");
    } finally {
      setSolicitando(false);
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;

    try {
      const res = await fetch(`/api/citas?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setExito("Cita cancelada correctamente");
        cargarCitas();
        setTimeout(() => setExito(""), 3000);
      } else {
        setError("Error al cancelar la cita");
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión");
    }
  };

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA": return { text: "Confirmada", color: "#10b981", bg: "#d1fae5" };
      case "CANCELADA": return { text: "Cancelada", color: "#ef4444", bg: "#fee2e2" };
      case "COMPLETADA": return { text: "Completada", color: "#8b5cf6", bg: "#ede9fe" };
      default: return { text: "Pendiente", color: "#f59e0b", bg: "#fef3c7" };
    }
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '2rem' },
    formCard: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' },
    formTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' },
    formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' as const, marginBottom: '1rem' },
    formGroup: { flex: 1, minWidth: '200px' },
    label: { display: 'block', fontWeight: '500', color: '#1e293b', marginBottom: '0.3rem', fontSize: '0.85rem' },
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
    textarea: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' as const, minHeight: '80px' },
    button: { padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    errorMessage: { background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' },
    successMessage: { background: '#d1fae5', color: '#065f46', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' },
    citasGrid: { display: 'grid', gap: '1rem' },
    citaCard: { background: 'white', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '1rem' },
    citaInfo: { display: 'flex', flexDirection: 'column' as const, gap: '0.3rem' },
    citaFecha: { fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' },
    citaMotivo: { fontSize: '0.8rem', color: '#64748b' },
    cancelButton: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem 1rem', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' },
    emptyState: { textAlign: 'center' as const, padding: '3rem', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', color: '#64748b' },
    estadoBadge: (estado: string) => {
      const info = getEstadoInfo(estado);
      return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '500', background: info.bg, color: info.color };
    }
  };

  if (status === "loading" || loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Mis Citas</h1>

      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>Solicitar nueva cita</h2>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {exito && <div style={styles.successMessage}>{exito}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha</label>
              <input
                type="date"
                style={styles.input}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Hora</label>
              <input
                type="time"
                style={styles.input}
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Motivo de la cita</label>
            <textarea
              style={styles.textarea}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describe el motivo de tu cita..."
            />
          </div>
          <button type="submit" style={styles.button} disabled={solicitando}>
            <FaPaperPlane /> {solicitando ? "Enviando..." : "Solicitar Cita"}
          </button>
        </form>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Mis citas programadas</h2>
      
      {citas.length === 0 ? (
        <div style={styles.emptyState}>
          <FaCalendarAlt style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
          <p>No tienes citas programadas.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Haz clic en "Solicitar Cita" para agendar una.</p>
        </div>
      ) : (
        <div style={styles.citasGrid}>
          {citas.map((cita) => (
            <div key={cita.id} style={styles.citaCard}>
              <div style={styles.citaInfo}>
                <div style={styles.citaFecha}>
                  <FaCalendarAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                  {cita.fecha} - {cita.hora}
                  <span style={styles.estadoBadge(cita.estado)}>{getEstadoInfo(cita.estado).text}</span>
                </div>
                {cita.motivo && <div style={styles.citaMotivo}><FaComment style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.7rem' }} /> {cita.motivo}</div>}
              </div>
              {cita.estado !== "CANCELADA" && (
                <button onClick={() => handleCancelar(cita.id)} style={styles.cancelButton}>
                  <FaTrash /> Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}