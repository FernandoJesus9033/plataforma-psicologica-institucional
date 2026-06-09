"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUpload, FaFileExcel, FaSpinner, FaDownload, FaArrowLeft, FaInfoCircle } from "react-icons/fa";

export default function TestBasePage() {
  const [session, setSession] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [testBase, setTestBase] = useState<any>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
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
      const testRes = await fetch("/api/test/base");
      if (testRes.ok) setTestBase(await testRes.json());
      setLoading(false);
    };
    cargar();
  }, [router]);

  const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.xlsx')) {
      setMensaje({ texto: "Solo se permiten archivos .xlsx", tipo: "error" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const res = await fetch("/api/test/base", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ texto: "✅ Test base subido correctamente", tipo: "success" });
        setTestBase(data.testBase);
      } else {
        setMensaje({ texto: data.error || "Error al subir", tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión", tipo: "error" });
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
    backButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '40px', textDecoration: 'none', color: '#475569' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    instructionsCard: { background: '#f0f9ff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #bae6fd', marginBottom: '1.5rem' },
    instructionsTitle: { fontSize: '1rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    instructionsList: { margin: 0, paddingLeft: '1.5rem', color: '#0c4a6e', fontSize: '0.85rem', lineHeight: 1.6 },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' },
    uploadLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: '40px', cursor: 'pointer', fontWeight: '500', width: 'fit-content' },
    downloadLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#eef2ff', borderRadius: '30px', textDecoration: 'none', color: '#4f46e5', marginTop: '1rem' },
    successMessage: { background: '#d1fae5', color: '#065f46', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' },
    errorMessage: { background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '12px', marginBottom: '1rem' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/configuracion" style={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
        <h1 style={styles.title}>📋 Test Base</h1>
      </div>

      {/* Instrucciones para la psicóloga */}
      <div style={styles.instructionsCard}>
        <div style={styles.instructionsTitle}>
          <FaInfoCircle /> Instrucciones importantes
        </div>
        <ul style={styles.instructionsList}>
          <li>El archivo debe ser un Excel (.xlsx) con las preguntas del test Gordon P-IPG</li>
          <li>Los alumnos podrán descargar este archivo desde su panel</li>
          <li>Completarán el test y lo subirán con el formato: <strong>Apellido_Nombre_Matricula.xlsx</strong></li>
          <li>Ejemplo: <strong>Gonzalez_Juan_2024001.xlsx</strong></li>
          <li>Solo puede haber un test base activo a la vez</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h3>Test actual</h3>
        {testBase ? (
          <div>
            <p><strong>Archivo:</strong> {testBase.archivoNombre}</p>
            <a href={testBase.archivoUrl} target="_blank" rel="noopener noreferrer" style={styles.downloadLink}>
              <FaDownload /> Descargar test actual
            </a>
          </div>
        ) : (
          <p>No hay test base cargado. Los alumnos no podrán descargar el test.</p>
        )}
      </div>

      <div style={styles.card}>
        <h3>Subir nuevo test</h3>
        {mensaje && (
          <div style={mensaje.tipo === "success" ? styles.successMessage : styles.errorMessage}>
            {mensaje.texto}
          </div>
        )}
        <label style={styles.uploadLabel}>
          <FaUpload /> {uploading ? "Subiendo..." : "Subir Excel (.xlsx)"}
          <input 
            type="file" 
            accept=".xlsx" 
            onChange={handleSubir} 
            style={{ display: 'none' }} 
            disabled={uploading} 
          />
        </label>
        {uploading && <FaSpinner style={{ animation: 'spin 1s linear infinite', marginTop: '1rem' }} />}
      </div>
    </div>
  );
}