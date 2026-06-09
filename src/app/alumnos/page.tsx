"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaUserGraduate } from "react-icons/fa";

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadAlumnos = async () => {
      const res = await fetch("/api/alumnos");
      if (res.ok) setAlumnos(await res.json());
      setLoading(false);
    };
    loadAlumnos();
  }, []);

  const filteredAlumnos = alumnos.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' },
    title: { fontSize: '1.8rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    newButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', borderRadius: '40px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '40px', padding: '0.4rem 1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    searchInput: { border: 'none', outline: 'none', fontSize: '0.9rem', width: '220px', background: 'transparent' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
    card: { background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' },
    cardEmail: { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' },
    cardDate: { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '1rem' },
    actions: { display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.3rem 0.6rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.3rem' },
    emptyState: { textAlign: 'center' as const, padding: '3rem', color: '#64748b' },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando alumnos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Alumnos</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={styles.searchBox}>
            <FaSearch color="#94a3b8" />
            <input type="text" placeholder="Buscar alumno..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/alumnos/nuevo" style={styles.newButton}>
            <FaPlus /> Nuevo Alumno
          </Link>
        </div>
      </div>

      {filteredAlumnos.length === 0 ? (
        <div style={styles.emptyState}>No hay alumnos registrados</div>
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
                <Link href={`/alumnos/${alumno.id}`} style={{ ...styles.actionBtn, color: '#4f46e5' }}><FaEye /> Ver</Link>
                <Link href={`/alumnos/${alumno.id}/editar`} style={{ ...styles.actionBtn, color: '#f59e0b' }}><FaEdit /> Editar</Link>
                <Link href={`/alumnos/${alumno.id}/eliminar`} style={{ ...styles.actionBtn, color: '#ef4444' }}><FaTrash /> Eliminar</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}