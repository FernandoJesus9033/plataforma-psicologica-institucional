"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaDownload, FaUser, FaCalendarAlt, FaComment, FaTrash, FaUpload, FaSpinner, FaCheck, FaPencilAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import ModalConfirmacion from "@/components/ModalConfirmacion";
import ToastNotificacion from "@/components/ToastNotificacion";

export default function ActividadDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [actividad, setActividad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: () => {} });
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" as "success" | "error" | "info" });
  const router = useRouter();

  const userRole = session?.user?.role;
  const isPsychologist = userRole === "PSYCHOLOGIST";

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isOpen: true, message, type });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/actividades/${id}`);
        if (res.ok) {
          const data = await res.json();
          setActividad(data);
          setComentario(data.comentario || "");
        } else {
          showToast("Error al cargar la actividad", "error");
        }
      } catch (error) {
        console.error(error);
        showToast("Error de conexión", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDescargar = (url: string, nombre: string) => {
    if (!url) return;
    if (url.includes("sharepoint") || url.includes("google") || url.includes("dropbox") || url.includes("onedrive") || url.includes("my.sharepoint")) {
      window.open(url, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = nombre;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubirEntrega = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("El archivo es demasiado grande. Máximo 10MB.", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("activityId", actividad.id);

    try {
      const res = await fetch("/api/actividades/entregar", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showToast("¡Trabajo entregado correctamente!", "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(data.error || "Error al entregar", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEditarNombre = async () => {
    if (!nuevoNombre.trim()) {
      showToast("El nombre no puede estar vacío", "error");
      return;
    }

    try {
      const res = await fetch("/api/actividades/entregar/nombre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actividadId: actividad.id, nuevoNombre: nuevoNombre.trim() })
      });
      const data = await res.json();

      if (data.success) {
        showToast("Nombre actualizado correctamente", "success");
        setEditandoNombre(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(data.error || "Error al actualizar nombre", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    }
  };

  const confirmarEliminarEntrega = () => {
    setModalConfig({
      title: "Eliminar entrega",
      message: "¿Estás seguro de que deseas eliminar tu entrega? Esta acción no se puede deshacer.",
      onConfirm: handleEliminarEntrega
    });
    setModalOpen(true);
  };

  const handleEliminarEntrega = async () => {
    try {
      const res = await fetch("/api/actividades/entregar/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actividadId: actividad.id })
      });
      const data = await res.json();

      if (data.success) {
        showToast("Entrega eliminada correctamente", "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(data.error || "Error al eliminar", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setModalOpen(false);
    }
  };

  const handleGuardarFeedback = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/actividades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario
        })
      });

      if (res.ok) {
        showToast("¡Retroalimentación guardada exitosamente!", "success");
        setTimeout(() => router.refresh(), 1500);
      } else {
        const error = await res.json();
        showToast(error.error || "Error al guardar la retroalimentación", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmarFeedback = () => {
    setModalConfig({
      title: "Guardar retroalimentación",
      message: "¿Estás seguro de que deseas guardar esta retroalimentación?",
      onConfirm: handleGuardarFeedback
    });
    setModalOpen(true);
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' },
    label: { fontWeight: '500', color: '#1e293b', marginBottom: '0.3rem', display: 'block' },
    fileLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', background: '#eef2ff', borderRadius: '30px', textDecoration: 'none', color: '#4f46e5', fontSize: '0.8rem', border: 'none', cursor: 'pointer' },
    textarea: { width: '100%', padding: '0.6rem', borderRadius: '12px', border: '1px solid #cbd5e1', resize: 'vertical' as const, minHeight: '100px' },
    button: { padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', marginTop: '1rem' },
    entregaContainer: { border: '2px dashed #10b981', borderRadius: '16px', padding: '1rem', background: '#f0fdf4', marginTop: '1rem' },
    entregaInfo: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
    entregaRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '0.5rem' },
    entregaButtons: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const },
    entregaButton: { display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '30px', fontSize: '0.75rem', border: 'none', cursor: 'pointer' },
    uploadButton: { background: '#4f46e5', color: 'white' },
    deleteButton: { background: '#fee2e2', color: '#ef4444' },
    sinEntrega: { border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '1rem', textAlign: 'center' as const, background: '#f8fafc', marginTop: '1rem', cursor: 'pointer' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  if (!actividad) return <div style={{ textAlign: 'center', padding: '4rem' }}>Actividad no encontrada</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href={isPsychologist ? "/actividades" : "/mis-actividades"} style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>{actividad.title}</h1>
      </div>

      {/* Información de la actividad */}
      <div style={styles.card}>
        <p><strong>Descripción:</strong> {actividad.description || "Sin descripción"}</p>
        {actividad.dueDate && <p><strong>Fecha límite:</strong> {new Date(actividad.dueDate).toLocaleDateString()}</p>}
        {actividad.fileUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Material adjunto:</strong>
            <button onClick={() => handleDescargar(actividad.fileUrl, actividad.fileName || "Descargar material")} style={styles.fileLink}>
              <FaDownload /> {actividad.fileName || "Descargar material"}
            </button>
          </div>
        )}
      </div>

      {/* Sección de entrega (solo para alumno) */}
      {!isPsychologist && (
        <div style={styles.card}>
          <h3>📤 Entregar trabajo</h3>
          
          {actividad.entregaUrl ? (
            <div style={styles.entregaContainer}>
              <div style={styles.entregaInfo}>
                <div style={styles.entregaRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const }}>
                    <FaCheck color="#10b981" />
                    <span><strong>Trabajo entregado:</strong></span>
                    {editandoNombre ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' as const }}>
                        <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', width: '200px' }} placeholder={actividad.entregaNombre || "nombre del archivo"} />
                        <button onClick={handleEditarNombre} style={{ ...styles.entregaButton, ...styles.uploadButton }}>Guardar</button>
                        <button onClick={() => setEditandoNombre(false)} style={{ ...styles.entregaButton, background: '#e2e8f0', color: '#475569' }}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => handleDescargar(actividad.entregaUrl, actividad.entregaNombre || "archivo")} style={{ ...styles.fileLink, background: '#eef2ff', margin: 0 }}><FaDownload /> {actividad.entregaNombre || "Ver archivo"}</button>
                        <button onClick={() => { setEditandoNombre(true); setNuevoNombre(actividad.entregaNombre || ""); }} style={{ ...styles.entregaButton, background: '#e2e8f0', color: '#475569' }}><FaPencilAlt /> Editar nombre</button>
                      </>
                    )}
                  </div>
                  <div style={styles.entregaButtons}>
                    <label style={{ ...styles.entregaButton, ...styles.uploadButton, cursor: 'pointer' }}><FaUpload /> Reemplazar <input type="file" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleSubirEntrega(e.target.files[0])} /></label>
                    <button onClick={confirmarEliminarEntrega} style={{ ...styles.entregaButton, ...styles.deleteButton }}><FaTrash /> Eliminar</button>
                  </div>
                </div>
                {actividad.entregadoEn && <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>Entregado: {new Date(actividad.entregadoEn).toLocaleDateString()}</p>}
              </div>
            </div>
          ) : (
            <div style={styles.sinEntrega} onClick={() => document.getElementById("file-input")?.click()}>
              <input id="file-input" type="file" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleSubirEntrega(e.target.files[0])} />
              {uploading ? <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '1.5rem', marginBottom: '0.5rem' }} /> : <><FaUpload color="#4f46e5" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} /><p style={{ fontSize: '0.8rem', margin: 0 }}>Haz clic para subir tu trabajo</p><p style={{ fontSize: '0.7rem', color: '#64748b' }}>PDF, Word, Imagen (máx 10MB)</p></>}
            </div>
          )}
        </div>
      )}

      {/* Retroalimentación (solo psicóloga) */}
      {isPsychologist && actividad.entregaUrl && (
        <div style={styles.card}>
          <h3>📝 Retroalimentación</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Trabajo entregado:</strong>
            <button onClick={() => handleDescargar(actividad.entregaUrl, actividad.entregaNombre || "Ver archivo")} style={styles.fileLink}>
              <FaDownload /> {actividad.entregaNombre || "Ver archivo"}
            </button>
          </div>
          <div>
            <label style={styles.label}>Retroalimentación / Comentario</label>
            <textarea
              style={styles.textarea}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe aquí tu retroalimentación para el alumno..."
            />
          </div>
          <button onClick={confirmarFeedback} style={styles.button} disabled={saving}>
            {saving ? "Guardando..." : "Guardar retroalimentación"}
          </button>
        </div>
      )}

      {/* Mostrar retroalimentación al alumno */}
      {!isPsychologist && actividad.comentario && (
        <div style={styles.card}>
          <h3>💬 Retroalimentación de la psicóloga</h3>
          <p>{actividad.comentario}</p>
        </div>
      )}

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
      
      <ToastNotificacion
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}