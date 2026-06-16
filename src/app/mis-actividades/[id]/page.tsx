"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaFile, FaUpload, FaSpinner, FaDownload } from "react-icons/fa";

interface Actividad {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  fileUrl: string;
  fileName: string;
  entregaUrl: string;
  entregaNombre: string;
}

export default function DetalleActividadPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Obtener el ID correctamente
  const paramsData = React.use(params);
  const { id } = paramsData;
  
  console.log("📝 ID obtenido de params:", id);
  console.log("📝 Tipo de ID:", typeof id);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user) {
      cargarActividad();
    }
  }, [status, session, router]);

  const cargarActividad = async () => {
    try {
      console.log("📝 Cargando actividad ID:", id);
      const res = await fetch(`/api/actividades/${id}`);
      console.log("📡 Status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📋 Actividad cargada:", data);
        setActividad(data);
      } else {
        setError("Error al cargar la actividad");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 10MB.");
        return;
      }
      console.log("📂 Archivo seleccionado:", selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor selecciona un archivo");
      return;
    }

    console.log("📝 === ENVIANDO ENTREGA ===");
    console.log("📝 actividadId:", id);
    console.log("📝 tipo de actividadId:", typeof id);
    console.log("📝 longitud:", id?.length);
    console.log("📝 file:", file.name);
    console.log("📝 file size:", file.size);
    console.log("📝 file type:", file.type);

    setUploading(true);
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("actividadId", id);

    // ✅ Verificar el contenido del FormData
    for (let pair of formData.entries()) {
      console.log("📝 FormData:", pair[0], pair[1]);
    }

    try {
      const res = await fetch("/api/actividades/entregar", {
        method: "POST",
        body: formData
      });

      console.log("📡 Status:", res.status);
      const data = await res.json();
      console.log("📋 Respuesta:", data);

      if (res.ok) {
        alert("¡Trabajo entregado correctamente!");
        router.push("/mis-actividades");
      } else {
        alert(data.error || "Error al entregar el trabajo");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error de conexión");
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' },
    label: { fontWeight: '500', color: '#1e293b', marginBottom: '0.3rem' },
    value: { color: '#475569', marginBottom: '1rem' },
    fileInput: { display: 'block', marginTop: '0.5rem' },
    submitButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '500', marginTop: '1rem' },
    fileInfo: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '12px', marginTop: '0.5rem' },
    downloadLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', textDecoration: 'none' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando actividad...</div>;
  }

  if (!actividad) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Actividad no encontrada</div>;
  }

  const isPsychologist = session?.user?.role === "PSYCHOLOGIST";
  const isStudent = session?.user?.role === "STUDENT";
  const isCompleted = actividad.status === "COMPLETED" || actividad.entregaUrl;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/mis-actividades" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>{actividad.title}</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Descripción</div>
        <div style={styles.value}>{actividad.description || "Sin descripción"}</div>

        <div style={styles.label}>Fecha límite</div>
        <div style={styles.value}>{new Date(actividad.dueDate).toLocaleDateString()}</div>

        {actividad.fileUrl && (
          <>
            <div style={styles.label}>Material adjunto</div>
            <a href={actividad.fileUrl} download style={styles.downloadLink}>
              <FaDownload /> {actividad.fileName || "Descargar archivo"}
            </a>
          </>
        )}
      </div>

      {isStudent && !isCompleted && !isPsychologist && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem' }}>Entregar trabajo</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={handleFileChange}
              style={styles.fileInput}
              required
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {file && (
              <div style={styles.fileInfo}>
                <FaFile /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
            <button type="submit" style={styles.submitButton} disabled={uploading}>
              {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
              {uploading ? "Subiendo..." : "Entregar trabajo"}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}