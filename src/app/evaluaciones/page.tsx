"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { FaClipboardList, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import ModalConfirmacion from "@/components/ModalConfirmacion";

interface Evaluation {
  id: string;
  score: number;
  status: string;
  createdAt: string;
  student: { id: string; name: string; email: string; };
}

interface Student {
  id: string;
  name: string;
  email: string;
}

export default function EvaluacionesPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluacionAEliminar, setEvaluacionAEliminar] = useState<string | null>(null);
  const { themeStyles } = useTheme();
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
    };
    loadSession();
  }, [router]);

  const isPsychologist = session?.user?.role === "PSYCHOLOGIST";

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  const loadData = async () => {
    try {
      const [evaluacionesRes, studentsRes] = await Promise.all([
        fetch("/api/eval"),
        fetch("/api/alumnos")
      ]);
      if (!evaluacionesRes.ok || !studentsRes.ok) return;
      setEvaluations(await evaluacionesRes.json());
      setStudents(await studentsRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/eval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: selectedStudent, score: parseInt(score) })
    });
    if (res.ok) {
      setSelectedStudent("");
      setScore("");
      setShowForm(false);
      loadData();
    }
  };

  const handleDeleteClick = (id: string) => {
    setEvaluacionAEliminar(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!evaluacionAEliminar) return;
    setDeletingId(evaluacionAEliminar);
    try {
      const res = await fetch(`/api/eval/${evaluacionAEliminar}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "No se pudo eliminar"}`);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión al eliminar");
    } finally {
      setDeletingId(null);
      setModalOpen(false);
      setEvaluacionAEliminar(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEvaluacionAEliminar(null);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "GREEN": return { text: "Estable", color: "#10b981", icon: <FaCheckCircle />, bg: "#10b98115" };
      case "YELLOW": return { text: "En observación", color: "#f59e0b", icon: <FaExclamationTriangle />, bg: "#f59e0b15" };
      case "RED": return { text: "Requiere atención", color: "#ef4444", icon: <FaExclamationTriangle />, bg: "#ef444415" };
      default: return { text: "Sin evaluar", color: "#6b7280", icon: <FaClipboardList />, bg: "#6b728015" };
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    titleSection: { display: 'flex', alignItems: 'center', gap: '1rem' },
    titleIcon: { fontSize: '2rem', color: '#10b981' },
    title: { fontSize: '2rem', fontWeight: '600', color: themeStyles.textColor },
    newButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '500', cursor: 'pointer' },
    formSection: { background: themeStyles.cardBg, borderRadius: '24px', padding: '1.8rem', marginBottom: '2rem', border: `1px solid ${themeStyles.borderColor}`, boxShadow: themeStyles.shadow },
    formTitle: { fontSize: '1.3rem', fontWeight: '600', color: themeStyles.textColor, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
    select: { padding: '0.8rem', borderRadius: '10px', border: `1px solid ${themeStyles.borderColor}`, fontSize: '1rem', background: themeStyles.inputBg, color: themeStyles.inputText, width: '100%' },
    input: { padding: '0.8rem', borderRadius: '10px', border: `1px solid ${themeStyles.borderColor}`, fontSize: '1rem', background: themeStyles.inputBg, color: themeStyles.inputText, width: '100%' },
    submitButton: { padding: '0.8rem 2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' },
    emptyState: { textAlign: 'center' as const, padding: '5rem 2rem', background: themeStyles.cardBg, borderRadius: '24px', border: `2px dashed ${themeStyles.borderColor}`, color: themeStyles.secondaryText, marginTop: '2rem' },
    emptyStateIcon: { fontSize: '5rem', color: themeStyles.secondaryText, marginBottom: '1rem' },
    emptyStateTitle: { fontSize: '1.5rem', fontWeight: '600', color: themeStyles.textColor, marginBottom: '0.5rem' },
    tableContainer: { background: themeStyles.cardBg, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${themeStyles.borderColor}`, boxShadow: themeStyles.shadow },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { background: '#4a90c4', color: 'white', padding: '1rem 1.2rem', textAlign: 'left' as const, fontWeight: '600', fontSize: '0.9rem' },
    td: { padding: '1rem 1.2rem', borderBottom: `1px solid ${themeStyles.borderColor}`, color: themeStyles.textColor },
    statusBadge: (status: string) => {
      const info = getStatusInfo(status);
      return { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '500', background: info.bg, color: info.color };
    },
    actionButtons: { display: 'flex', gap: '0.8rem' },
    editButton: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '8px', background: '#4a90c415', color: '#4a90c4', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '500' },
    deleteButton: (isDeleting: boolean) => ({ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '8px', background: '#ef444415', color: '#ef4444', border: 'none', cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: '500', opacity: isDeleting ? 0.6 : 1 }),
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando evaluaciones...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <FaClipboardList style={styles.titleIcon} />
          <h1 style={styles.title}>Evaluaciones Psicológicas</h1>
        </div>
        <button style={styles.newButton} onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? "Cancelar" : "Nueva Evaluación"}
        </button>
      </div>

      {showForm && (
        <div style={styles.formSection}>
          <h2 style={styles.formTitle}><FaPlus /> Registrar Nueva Evaluación</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <select style={styles.select} value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                <option value="">Seleccionar alumno</option>
                {students.map((s) => (<option key={s.id} value={s.id}>{s.name} - {s.email}</option>))}
              </select>
              <input type="number" min="0" max="100" step="1" placeholder="Puntaje (0-100)" style={styles.input} value={score} onChange={(e) => setScore(e.target.value)} required />
              <button type="submit" style={styles.submitButton}>Guardar Evaluación</button>
            </div>
          </form>
        </div>
      )}

      {evaluations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>📝</div>
          <h2 style={styles.emptyStateTitle}>No hay evaluaciones registradas</h2>
          <p>Comienza creando la primera evaluación para un alumno.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Alumno</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Puntaje</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Fecha</th>
                {isPsychologist && <th style={styles.th}>Acciones</th>}
               </tr>
            </thead>
            <tbody>
              {evaluations.map((e) => {
                const statusInfo = getStatusInfo(e.status);
                return (
                  <tr key={e.id}>
                    <td style={styles.td}>{e.student.name}</td>
                    <td style={styles.td}>{e.student.email}</td>
                    <td style={styles.td}><strong style={{ color: statusInfo.color }}>{e.score}</strong></td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(e.status)}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(e.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    {isPsychologist && (
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <Link href={`/evaluaciones/${e.id}/editar`} style={styles.editButton}>
                            <FaEdit /> Editar
                          </Link>
                          <button onClick={() => handleDeleteClick(e.id)} style={styles.deleteButton(deletingId === e.id)} disabled={deletingId === e.id}>
                            <FaTrash /> {deletingId === e.id ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar evaluación"
        message="¿Estás segura de que deseas eliminar esta evaluación? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}