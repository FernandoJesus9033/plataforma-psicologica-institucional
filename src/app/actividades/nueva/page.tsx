"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaFileAlt } from "react-icons/fa";
import FileUpload from "@/components/FileUpload";

export default function NuevaActividadPage() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [fileData, setFileData] = useState({ url: "", name: "", type: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/alumnos");
      if (res.ok) setAlumnos(await res.json());
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/actividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          studentId,
          dueDate: dueDate || null,
          fileUrl: fileData.url,
          fileName: fileData.name,
          fileType: fileData.type
        })
      });
      if (res.ok) router.push("/actividades");
      else alert("Error al crear actividad");
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    formGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', fontWeight: '500', color: '#1e293b', marginBottom: '0.3rem' },
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
    textarea: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' as const, minHeight: '80px' },
    select: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
    buttonGroup: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    cancelButton: { flex: 1, padding: '0.7rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '40px', textAlign: 'center', textDecoration: 'none' },
    submitButton: { flex: 1, padding: '0.7rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/actividades" style={styles.backButton}><FaArrowLeft /> Volver</Link>
        <h1 style={styles.title}>Nueva Actividad</h1>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Título *</label>
            <input type="text" style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Descripción</label>
            <textarea style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Asignar a *</label>
            <select style={styles.select} value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
              <option value="">Seleccionar alumno</option>
              {alumnos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fecha límite</label>
            <input type="date" style={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}><FaFileAlt /> Archivo adjunto</label>
            <FileUpload onFileUploaded={(file) => setFileData(file)} />
          </div>
          <div style={styles.buttonGroup}>
            <Link href="/actividades" style={styles.cancelButton}>Cancelar</Link>
            <button type="submit" style={styles.submitButton} disabled={saving}>
              <FaSave /> {saving ? "Creando..." : "Crear Actividad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}