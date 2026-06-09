"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUpload, FaDownload, FaSpinner, FaArrowLeft, FaInfoCircle } from "react-icons/fa";

export default function TestExcelPage() {
  const [session, setSession] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [testBase, setTestBase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alumno, setAlumno] = useState<any>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setSession(data);
      
      // Obtener datos del alumno
      const userRes = await fetch("/api/alumno/actual");
      if (userRes.ok) {
        const userData = await userRes.json();
        setAlumno(userData);
      }
      
      const testRes = await fetch("/api/test/base");
      if (testRes.ok) {
        const test = await testRes.json();
        setTestBase(test);
      }
      setLoading(false);
    };
    cargar();
  }, [router]);

  const generarNombreArchivo = (nombreOriginal: string) => {
    if (!alumno) return nombreOriginal;
    
    // Obtener apellido y nombre
    const nombreCompleto = alumno.name || "";
    const partes = nombreCompleto.split(" ");
    const apellido = partes[0] || "Apellido";
    const nombre = partes[1] || "Nombre";
    const matricula = alumno.matricula || "0000";
    
    // Obtener extensión
    const extension = nombreOriginal.split(".").pop();
    const nombreSinExtension = nombreOriginal.replace(/\.[^/.]+$/, "");
    
    // Si el usuario ya usó el formato correcto, respetarlo
    if (nombreSinExtension.includes("_") && nombreSinExtension.split("_").length >= 3) {
      return nombreOriginal;
    }
    
    return `${apellido}_${nombre}_${matricula}.${extension}`;
  };

  const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setMensaje({ texto: "Solo se permiten archivos .xlsx", tipo: "error" });
      return;
    }

    // Validar formato del nombre
    const nombreSinExtension = file.name.replace(/\.[^/.]+$/, "");
    const partes = nombreSinExtension.split("_");
    
    if (partes.length < 3) {
      setMensaje({ 
        texto: "⚠️ El nombre del archivo debe seguir el formato: Apellido_Nombre_Matricula.xlsx", 
        tipo: "error" 
      });
      return;
    }

    const nuevoNombre = generarNombreArchivo(file.name);
    
    setUploading(true);
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("nombreAlumno", alumno?.name || "");
    formData.append("matricula", alumno?.matricula || "");

    try {
      const res = await fetch("/api/test/subir-excel", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setMensaje({ texto: `✅ Archivo subido correctamente como: ${nuevoNombre}`, tipo: "success" });
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setMensaje({ texto: data.error || "Error al subir", tipo: "error" });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ texto: "Error de conexión", tipo: "error" });
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    instructionsCard: { background: '#f0f9ff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #bae6fd', marginBottom: '1.5rem' },
    instructionsTitle: { fontSize: '1rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    instructionsList: { margin: 0, paddingLeft: '1.5rem', color: '#0c4a6e', fontSize: '0.85rem', lineHeight: 1.6 },
    card: { background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', textAlign: 'center' as const },
    icon: { fontSize: '4rem', color: '#4a90c4', marginBottom: '1rem' },
    cardTitle: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
    description: { color: '#64748b', marginBottom: '1rem' },
    downloadLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: '40px', textDecoration: 'none', marginBottom: '1.5rem' },
    uploadLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#10b981', color: 'white', borderRadius: '40px', cursor: 'pointer', fontWeight: '500', margin: '0 auto', width: 'fit-content' },
    successMessage: { background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '12px', marginTop: '1rem' },
    errorMessage: { background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginTop: '1rem' },
    formatoEjemplo: { background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '0.5rem', color: '#475569' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/dashboard" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>Test de Personalidad</h1>
      </div>

      {/* Instrucciones para el alumno */}
      <div style={styles.instructionsCard}>
        <div style={styles.instructionsTitle}>
          <FaInfoCircle /> Instrucciones importantes
        </div>
        <ul style={styles.instructionsList}>
          <li>Descarga el archivo Excel del test</li>
          <li>Completa el test marcando con "1" en las columnas + y -</li>
          <li>Guarda el archivo con el formato: <strong>Apellido_Nombre_Matricula.xlsx</strong></li>
          <li>Ejemplo: <strong>Gonzalez_Juan_2024001.xlsx</strong></li>
          <li>Sube el archivo completado usando el botón de abajo</li>
        </ul>
      </div>

      <div style={styles.card}>
        <div style={styles.icon}>📋</div>
        <h2 style={styles.cardTitle}>Completa el test</h2>
        <p style={styles.description}>
          Descarga el archivo Excel, complétalo y súbelo aquí.
        </p>

        {testBase ? (
          <a href={testBase.archivoUrl} target="_blank" rel="noopener noreferrer" style={styles.downloadLink}>
            <FaDownload /> Descargar Test ({testBase.archivoNombre})
          </a>
        ) : (
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>No hay test disponible. Contacta a la psicóloga.</p>
        )}

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Formato requerido:</p>
          <div style={styles.formatoEjemplo}>
            {alumno ? `${alumno.name?.split(" ")[0] || "Apellido"}_${alumno.name?.split(" ")[1] || "Nombre"}_${alumno.matricula || "Matricula"}.xlsx` : "Apellido_Nombre_Matricula.xlsx"}
          </div>
        </div>

        <label style={styles.uploadLabel}>
          <FaUpload /> {uploading ? "Subiendo..." : "Subir Excel completado"}
          <input type="file" accept=".xlsx" onChange={handleSubir} style={{ display: 'none' }} disabled={uploading} />
        </label>

        {uploading && <FaSpinner style={{ animation: 'spin 1s linear infinite', marginTop: '1rem' }} />}

        {mensaje && (
          <div style={mensaje.tipo === "success" ? styles.successMessage : styles.errorMessage}>
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
}