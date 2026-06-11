"use client";

import { useState, useRef } from "react";
import { FaUpload, FaFile, FaTrash, FaSpinner } from "react-icons/fa";

interface FileUploadProps {
  onFileUploaded: (fileData: { url: string; name: string; type: string }) => void;
  initialFile?: { url: string; name: string } | null;
}

export default function FileUpload({ onFileUploaded, initialFile }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ url: string; name: string } | null>(initialFile || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 10MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/actividades/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      // ✅ CAMBIO: en lugar de data.success, usamos data.url
      if (data.url) {
        setFileInfo({ url: data.url, name: data.name });
        onFileUploaded({ url: data.url, name: data.name, type: data.type });
      } else {
        alert(data.error || "Error al subir archivo");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFileInfo(null);
    onFileUploaded({ url: "", name: "", type: "" });
    if (inputRef.current) inputRef.current.value = "";
  };

  if (fileInfo) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f5f9', padding: '0.75rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaFile color="#4f46e5" /> <span>{fileInfo.name}</span>
          <a href={fileInfo.url} target="_blank" style={{ color: '#4f46e5', marginLeft: '0.5rem' }}>Ver</a>
        </div>
        <button onClick={removeFile} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
      </div>
    );
  }

  return (
    <div onClick={() => inputRef.current?.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
      <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {uploading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaUpload color="#4f46e5" />}
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Arrastra o haz clic para subir un archivo (PDF, Word, Imagen, máx 10MB)</p>
    </div>
  );
}