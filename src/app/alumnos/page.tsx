"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaUserGraduate, FaSpinner } from "react-icons/fa";

interface Alumno {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AlumnosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.role === "PSYCHOLOGIST") {
      cargarAlumnos();
    } else if (session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const cargarAlumnos = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔄 Cargando alumnos...");
      const res = await fetch("/api/alumnos");
      console.log("📡 Status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📋 Alumnos:", data);
        setAlumnos(Array.isArray(data) ? data : []);
      } else {
        const errorData = await res.json();
        console.error("❌ Error:", errorData);
        setError(errorData.error || "Error al cargar alumnos");
        setAlumnos([]);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setError("Error de conexión al servidor");
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name}?`)) return;
    
    try {
      const res = await fetch(`/api/alumnos?email=${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        console.log("✅ Alumno eliminado");
        await cargarAlumnos();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  const filteredAlumnos = alumnos.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    newButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', borderRadius: '40px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '0.4rem 1rem' },
    searchInput: { border: 'none', outline: 'none', fontSize: '0.9rem', width: '220px', background: 'transparent' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' },
    cardEmail: { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' },
    cardDate: { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '1rem' },
    actions: { display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.3rem 0.6rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.3rem' },
    emptyState: { textAlign: 'center' as const, padding: '3rem', color: '#64748b' },
    errorBox: { background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center' as const }
  };

  if (status === "loading" || loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto" />
        <p className="mt-2">Cargando alumnos...</p>
      </div>
    );
  }

  if (session?.user?.role !== "PSYCHOLOGIST") {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p>Acceso no autorizado. Solo psicólogos pueden ver esta página.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Alumnos</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={styles.searchBox}>
            <FaSearch color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Buscar alumno..." 
              style={styles.searchInput} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <Link href="/alumnos/nuevo" style={styles.newButton}>
            <FaPlus /> Nuevo Alumno
          </Link>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          {error}
          <button onClick={cargarAlumnos} style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      )}

      {filteredAlumnos.length === 0 && !error ? (
        <div style={styles.emptyState}>
          {searchTerm ? "No se encontraron alumnos" : "No hay alumnos registrados"}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredAlumnos.map(alumno => (
            <div key={alumno.id} style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '40px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <FaUserGraduate />
                </div>
                <div>
                  <div style={styles.cardTitle}>{alumno.name}</div>
                  <div style={styles.cardEmail}>{alumno.email}</div>
                </div>
              </div>
              <div style={styles.cardDate}>Registro: {new Date(alumno.createdAt).toLocaleDateString()}</div>
              <div style={styles.actions}>
                <Link href={`/alumnos/${alumno.id}`} style={{ ...styles.actionBtn, color: '#4f46e5' }}>
                  <FaEye /> Ver
                </Link>
                <Link href={`/alumnos/${alumno.id}/editar`} style={{ ...styles.actionBtn, color: '#f59e0b' }}>
                  <FaEdit /> Editar
                </Link>
                <button onClick={() => handleDelete(alumno.email, alumno.name)} style={{ ...styles.actionBtn, color: '#ef4444' }}>
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}