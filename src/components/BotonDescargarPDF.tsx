"use client";

import { useState } from "react";
import { FaDownload } from "react-icons/fa";

interface BotonDescargarPDFProps {
  expedienteRef: React.RefObject<HTMLDivElement | null>;
  nombreAlumno: string;
}

export default function BotonDescargarPDF({ expedienteRef, nombreAlumno }: BotonDescargarPDFProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!expedienteRef.current) {
      alert("No se pudo generar el PDF");
      return;
    }

    setDownloading(true);
    try {
      // ✅ Forzar las versiones de navegador (ESM) directamente
      const html2canvasModule = await import('html2canvas');
      const jsPDFModule = await import('jspdf');
      
      const html2canvas = html2canvasModule.default;
      const jsPDF = jsPDFModule.default;

      const canvas = await html2canvas(expedienteRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`expediente_${nombreAlumno || "alumno"}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setDownloading(false);
    }
  };

  const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.7rem 1.5rem',
    background: '#4a90c4',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  return (
    <button onClick={handleDownload} style={styles} disabled={downloading}>
      <FaDownload /> {downloading ? "Generando PDF..." : "Descargar PDF"}
    </button>
  );
}