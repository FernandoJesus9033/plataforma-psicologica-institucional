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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        console.log("📋 Alumnos cargados:", data.length);
        // Mostrar los IDs reales en consola
        console.log("📋 IDs de alumnos:", data.map((a: Alumno) => ({ 
          id: a.id, 
          name: a.name,
          tipoId: typeof a.id,
          longitud: a.id?.length
        })));
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
    
    setDeletingId(id);
    try {
      console.log("🗑️ Eliminando alumno ID:", id, "Type:", typeof id);
      const res = await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        console.log("✅ Alumno eliminado exitosamente");
        await cargarAlumnos();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error de conexión");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAlumnos = alumnos.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    newButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', borderRadius: '40px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'background 0.2s' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '0.4rem 1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    searchInput: { border: 'none', outline: 'none', fontSize: '0.9rem', width: '220px', background: 'transparent' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' },
    cardEmail: { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', wordBreak: 'break-all' as const },
    cardDate: { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem' },
    cardId: { fontSize: '0.65rem', color: '#cbd5e1', marginBottom: '1rem', fontFamily: 'monospace' },
    actions: { display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.3rem 0.6rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', transition: 'background 0.2s' },
    emptyState: { textAlign: 'center' as const, padding: '4rem', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', color: '#64748b' },
    errorBox: { background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center' as const },
    loadingState: { textAlign: 'center' as const, padding: '4rem', color: '#64748b' }
  };

  if (status === "loading" || loading) {
    return (
      <div style={styles.loadingState}>
        <FaSpinner className="animate-spin" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4f46e5' }} />
        <p>Cargando alumnos...</p>
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

  if (session?.user?.role !== "PSYCHOLOGIST") {
    return (
      <div style={styles.loadingState}>
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
          <FaUserGraduate style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
          <p>{searchTerm ? "No se encontraron alumnos" : "No hay alumnos registrados"}</p>
          {!searchTerm && (
            <Link href="/alumnos/nuevo" style={{ ...styles.newButton, display: 'inline-flex', marginTop: '1rem' }}>
              <FaPlus /> Crear primer alumno
            </Link>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredAlumnos.map((alumno) => (
            <div key={alumno.id} style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '40px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <FaUserGraduate size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.cardTitle}>{alumno.name}</div>
                  <div style={styles.cardEmail}>{alumno.email}</div>
                </div>
              </div>
              <div style={styles.cardDate}>
                📅 Registro: {new Date(alumno.createdAt).toLocaleDateString()}
              </div>
              <div style={styles.cardId}>
                🆔 ID: {alumno.id}
              </div>
              <div style={styles.actions}>
                <Link 
                  href={`/alumnos/${alumno.id}`} 
                  style={{ ...styles.actionBtn, color: '#4f46e5', background: '#eef2ff' }}
                >
                  <FaEye size={12} /> Ver
                </Link>
                <Link 
                  href={`/alumnos/${alumno.id}/editar`} 
                  style={{ ...styles.actionBtn, color: '#f59e0b', background: '#fef3c7' }}
                >
                  <FaEdit size={12} /> Editar
                </Link>
                <button 
                  onClick={() => handleDelete(alumno.id, alumno.name)} 
                  style={{ ...styles.actionBtn, color: '#ef4444', background: '#fee2e2' }}
                  disabled={deletingId === alumno.id}
                >
                  {deletingId === alumno.id ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />} 
                  Eliminar
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
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}