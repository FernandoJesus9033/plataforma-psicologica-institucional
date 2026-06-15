"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaDownload, FaUpload, FaSpinner } from "react-icons/fa";

export default function TestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testBase, setTestBase] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) {
      cargarTestBase();
    }
  }, [status, session, router]);

  const cargarTestBase = async () => {
    const res = await fetch("/api/test/base");
    if (res.ok) {
      const data = await res.json();
      setTestBase(data);
    }
  };

  const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setMensaje("❌ Solo se permiten archivos .xlsx");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const res = await fetch("/api/test/subir-excel", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setMensaje("✅ Test subido correctamente");
      } else {
        setMensaje("❌ Error al subir el test");
      }
    } catch (error) {
      setMensaje("❌ Error de conexión");
    } finally {
      setUploading(false);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' },
    instructions: { fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 },
    downloadLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', borderRadius: '30px', textDecoration: 'none', marginBottom: '1rem' },
    uploadLabel: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', borderRadius: '30px', cursor: 'pointer' },
    mensaje: { padding: '0.8rem', borderRadius: '12px', marginTop: '1rem', background: '#d1fae5', color: '#065f46' }
  };

  if (status === "loading") return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Test de Personalidad</h1>
      
      <div style={styles.card}>
        <p style={styles.instructions}>
          📌 Descarga el archivo Excel, complétalo y súbelo aquí.<br />
          📌 Formato requerido: <strong>Apellido_Nombre_Matricula.xlsx</strong><br />
          📌 Ejemplo: <strong>Gonzalez_Juan_2024001.xlsx</strong>
        </p>
        
        {testBase && (
          <a href={testBase.archivoUrl} download style={styles.downloadLink}>
            <FaDownload /> Descargar Test ({testBase.archivoNombre})
          </a>
        )}
      </div>

      <div style={styles.card}>
        <h3>Subir test completado</h3>
        <label style={styles.uploadLabel}>
          <FaUpload /> {uploading ? "Subiendo..." : "Subir Excel completado"}
          <input type="file" accept=".xlsx" onChange={handleSubir} style={{ display: 'none' }} disabled={uploading} />
        </label>
        {mensaje && <div style={styles.mensaje}>{mensaje}</div>}
      </div>
    </div>
  );
}