"use client";

import { useState, useRef } from "react";
import { FaUpload, FaFile, FaSpinner, FaCheck, FaDownload, FaTrash, FaPencilAlt } from "react-icons/fa";
import ModalConfirmacion from "./ModalConfirmacion";
import ToastNotificacion from "./ToastNotificacion";

interface EntregaArchivoProps {
  actividadId: string;
  onEntregado: () => void;
  entregaUrl?: string;
  entregaNombre?: string;
  entregadoEn?: string;
  status?: string;
}

export default function EntregaArchivo({ 
  actividadId, 
  onEntregado, 
  entregaUrl, 
  entregaNombre, 
  entregadoEn,
  status 
}: EntregaArchivoProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(entregaNombre || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: () => {} });
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" as "success" | "error" | "info" });
  const inputRef = useRef<HTMLInputElement>(null);
  const entregado = !!entregaUrl;
  const puedeEditar = status !== "COMPLETED" && status !== "PENDING_REVIEW";

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isOpen: true, message, type });
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("El archivo es demasiado grande. Máximo 10MB.", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("actividadId", actividadId);

    try {
      const res = await fetch("/api/actividades/entregar", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showToast("¡Trabajo entregado correctamente!", "success");
        onEntregado();
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

  const confirmEliminar = () => {
    setModalConfig({
      title: "Eliminar entrega",
      message: "¿Estás seguro de que deseas eliminar tu entrega? Esta acción no se puede deshacer.",
      onConfirm: handleEliminar
    });
    setModalOpen(true);
  };

  const handleEliminar = async () => {
    setDeleting(true);
    setModalOpen(false);
    try {
      const res = await fetch("/api/actividades/entregar/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actividadId })
      });
      const data = await res.json();

      if (data.success) {
        showToast("Entrega eliminada correctamente", "success");
        onEntregado();
      } else {
        showToast(data.error || "Error al eliminar", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    } finally {
      setDeleting(false);
    }
  };

  const confirmReemplazar = () => {
    setModalConfig({
      title: "Reemplazar entrega",
      message: "¿Estás seguro de que deseas reemplazar tu entrega actual? El archivo anterior se perderá.",
      onConfirm: () => inputRef.current?.click()
    });
    setModalOpen(true);
  };

  const handleGuardarNombre = async () => {
    if (!nuevoNombre.trim()) return;
    
    try {
      const res = await fetch("/api/actividades/entregar/nombre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actividadId, nuevoNombre: nuevoNombre.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setEditandoNombre(false);
        showToast("Nombre actualizado correctamente", "success");
        onEntregado();
      } else {
        showToast(data.error || "Error al actualizar nombre", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
    }
  };

  const styles = {
    container: {
      border: `2px dashed ${entregado ? '#10b981' : '#cbd5e1'}`,
      borderRadius: '16px',
      padding: '1rem',
      background: entregado ? '#f0fdf4' : '#f8fafc',
      marginTop: '1rem'
    },
    info: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '0.5rem' },
    fileInfo: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const },
    buttonGroup: { display: 'flex', gap: '0.5rem' },
    button: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '30px', fontSize: '0.75rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
    primaryButton: { background: '#4f46e5', color: 'white' },
    dangerButton: { background: '#fee2e2', color: '#ef4444' },
    secondaryButton: { background: '#e2e8f0', color: '#475569' }
  };

  if (entregado) {
    return (
      <>
        <div style={styles.container}>
          <div style={styles.info}>
            <div style={styles.fileInfo}>
              <FaCheck color="#10b981" />
              <span><strong>Trabajo entregado</strong></span>
              {entregaNombre && (
                <>
                  {editandoNombre ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={nuevoNombre} 
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        style={{ padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                      <button onClick={handleGuardarNombre} style={{ ...styles.button, ...styles.primaryButton }}>Guardar</button>
                      <button onClick={() => setEditandoNombre(false)} style={{ ...styles.button, ...styles.secondaryButton }}>Cancelar</button>
                    </div>
                  ) : (
                    <a href={entregaUrl} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4f46e5' }}>
                      <FaDownload /> {entregaNombre}
                    </a>
                  )}
                </>
              )}
              {entregadoEn && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Entregado: {new Date(entregadoEn).toLocaleDateString()}</span>}
            </div>
            {puedeEditar && (
              <div style={styles.buttonGroup}>
                <button onClick={confirmReemplazar} style={{ ...styles.button, ...styles.primaryButton }} disabled={uploading}>
                  <FaUpload /> {uploading ? "Subiendo..." : "Reemplazar"}
                </button>
                <button onClick={() => setEditandoNombre(true)} style={{ ...styles.button, ...styles.secondaryButton }}>
                  <FaPencilAlt /> Editar nombre
                </button>
                <button onClick={confirmEliminar} style={{ ...styles.button, ...styles.dangerButton }} disabled={deleting}>
                  <FaTrash /> {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>

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
      </>
    );
  }

  return (
    <>
      <div style={styles.container} onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        {uploading ? (
          <div style={{ textAlign: 'center' }}>
            <FaSpinner style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
            <p>Subiendo archivo...</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <FaUpload color="#4f46e5" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.8rem', margin: 0 }}>Haz clic para subir tu trabajo</p>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>PDF, Word, Imagen (máx 10MB)</p>
          </div>
        )}
      </div>

      <ToastNotificacion
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </>
  );
}