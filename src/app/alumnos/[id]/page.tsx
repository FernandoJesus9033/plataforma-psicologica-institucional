"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaBrain, FaUserGraduate, FaEnvelope, FaIdCard, FaSpinner } from "react-icons/fa";

interface Alumno {
  id: string;
  name: string;
  email: string;
  matricula: string;
  createdAt: string;
}

export default function AlumnoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadAlumno = async () => {
      try {
        console.log("🔄 Cargando alumno ID:", id);
        const res = await fetch(`/api/alumnos/${id}`);
        console.log("📡 Status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Alumno cargado:", data);
          setAlumno(data);
        } else if (res.status === 404) {
          setError("Alumno no encontrado");
        } else {
          const data = await res.json();
          setError(data.error || "Error al cargar el alumno");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    loadAlumno();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${alumno?.name}? Esta acción no se puede deshacer.`)) return;
    
    setDeleting(true);
    try {
      console.log("🗑️ Eliminando alumno:", id);
      const res = await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        console.log("✅ Alumno eliminado");
        router.push("/alumnos");
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error de conexión");
    } finally {
      setDeleting(false);
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' as const },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    infoRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' },
    actionButtons: { display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' as const },
    editButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', borderRadius: '8px', textDecoration: 'none', border: 'none', cursor: 'pointer' },
    deleteButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#ef4444', color: 'white', borderRadius: '8px', textDecoration: 'none', border: 'none', cursor: 'pointer' },
    loadingState: { textAlign: 'center' as const, padding: '4rem', color: '#64748b' },
    errorBox: { background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', textAlign: 'center' as const }
  };

  if (loading) {
    return (
      <div style={styles.loadingState}>
        <FaSpinner className="animate-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
        <p>Cargando alumno...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>{error}</div>
        <Link href="/alumnos" style={styles.backButton}>
          <FaArrowLeft /> Volver a Alumnos
        </Link>
      </div>
    );
  }

  if (!alumno) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>Alumno no encontrado</div>
        <Link href="/alumnos" style={styles.backButton}>
          <FaArrowLeft /> Volver a Alumnos
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/alumnos" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>{alumno.name}</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.infoRow}>
          <FaUserGraduate size={18} color="#4f46e5" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Nombre completo</div>
            <div style={{ fontWeight: '500' }}>{alumno.name}</div>
          </div>
        </div>
        
        <div style={styles.infoRow}>
          <FaEnvelope size={18} color="#4f46e5" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Correo electrónico</div>
            <div>{alumno.email}</div>
          </div>
        </div>
        
        <div style={styles.infoRow}>
          <FaIdCard size={18} color="#4f46e5" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Matrícula</div>
            <div>{alumno.matricula || "No registrada"}</div>
          </div>
        </div>
        
        <div style={styles.infoRow}>
          <FaCalendarAlt size={18} color="#4f46e5" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Fecha de registro</div>
            <div>{new Date(alumno.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <Link href={`/alumnos/${id}/editar`} style={styles.editButton}>
            <FaEdit /> Editar
          </Link>
          <button onClick={handleDelete} style={styles.deleteButton} disabled={deleting}>
            {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />} 
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}