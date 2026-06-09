"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaStickyNote } from "react-icons/fa";

interface NotasPrivadasProps {
  studentId: string;
}

export default function NotasPrivadas({ studentId }: NotasPrivadasProps) {
  const [notes, setNotes] = useState("");
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarNotas();
  }, [studentId]);

  const cargarNotas = async () => {
    try {
      const res = await fetch(`/api/alumnos/${studentId}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || "");
      }
    } catch (error) {
      console.error("Error al cargar notas:", error);
    } finally {
      setCargando(false);
    }
  };

  const guardarNotas = async () => {
    setGuardando(true);
    try {
      const res = await fetch(`/api/alumnos/${studentId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });

      if (res.ok) {
        setEditando(false);
      } else {
        alert("Error al guardar notas");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar notas");
    } finally {
      setGuardando(false);
    }
  };

  const styles = {
    container: {
      background: '#fef9e6',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #fde68a',
      marginTop: '1.5rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#b45309',
    },
    content: {
      minHeight: '100px',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '0.8rem',
      borderRadius: '12px',
      border: '1px solid #fde68a',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      backgroundColor: '#fff7e6',
    },
    textDisplay: {
      background: '#fff7e6',
      padding: '1rem',
      borderRadius: '12px',
      whiteSpace: 'pre-wrap' as const,
      fontSize: '0.95rem',
      lineHeight: '1.5',
      color: '#78350f',
      minHeight: '100px',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s ease',
    },
    editButton: {
      background: '#f59e0b',
      color: 'white',
    },
    saveButton: {
      background: '#10b981',
      color: 'white',
    },
    cancelButton: {
      background: '#ef4444',
      color: 'white',
    },
    emptyState: {
      color: '#b45309',
      opacity: 0.7,
      fontStyle: 'italic' as const,
    },
  };

  if (cargando) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <FaStickyNote /> Notas Privadas
          </div>
        </div>
        <div style={styles.textDisplay}>Cargando notas...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <FaStickyNote /> Notas Privadas
        </div>
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            style={{ ...styles.button, ...styles.editButton }}
          >
            <FaEdit /> Editar
          </button>
        )}
      </div>

      <div style={styles.content}>
        {editando ? (
          <>
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe aquí tus notas privadas sobre el alumno..."
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={guardarNotas}
                disabled={guardando}
                style={{ ...styles.button, ...styles.saveButton }}
              >
                <FaSave /> {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => {
                  setEditando(false);
                  cargarNotas();
                }}
                style={{ ...styles.button, ...styles.cancelButton }}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </>
        ) : (
          <div style={styles.textDisplay}>
            {notes && notes.trim() !== "" ? (
              notes
            ) : (
              <span style={styles.emptyState}>
                No hay notas registradas. Haz clic en "Editar" para agregar notas privadas.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}