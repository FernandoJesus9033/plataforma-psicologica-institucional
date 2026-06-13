"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { 
  FaTasks, FaClipboardList, FaCalendarAlt, FaCog, FaArrowRight, FaFileExcel, FaUsers
} from "react-icons/fa";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    if (session?.user) {
      setUserRole(session.user.role || null);
      setUserName(session.user.name || session.user.email || "");
      setLoading(false);
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Cargando...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isPsychologist = userRole === "PSYCHOLOGIST";
  const isStudent = userRole === "STUDENT";

  const studentModules = [
    { icon: <FaFileExcel />, title: "Test Psicológico", desc: "Descarga el test, complétalo y súbelo aquí", link: "/test-excel" },
    { icon: <FaTasks />, title: "Mis Actividades", desc: "Completa las actividades asignadas", link: "/mis-actividades" },
    { icon: <FaClipboardList />, title: "Mis Evaluaciones", desc: "Consulta tus evaluaciones", link: "/mis-evaluaciones" },
    { icon: <FaCalendarAlt />, title: "Mis Citas", desc: "Revisa tus citas programadas", link: "/mis-citas" },
    { icon: <FaCog />, title: "Configuración", desc: "Ajusta tus preferencias", link: "/configuracion" },
  ];

  const psychologistModules = [
    { icon: <FaTasks />, title: "Actividades", desc: "Crea y asigna actividades", link: "/actividades" },
    { icon: <FaClipboardList />, title: "Evaluaciones", desc: "Registra evaluaciones", link: "/evaluaciones" },
    { icon: <FaCalendarAlt />, title: "Agenda", desc: "Administra citas", link: "/agenda" },
    { icon: <FaFileExcel />, title: "Resultados Test", desc: "Consulta resultados del test", link: "/test-resultados" },
    { icon: <FaCog />, title: "Configuración", desc: "Ajustes", link: "/configuracion" },
  ];

  const modules = isPsychologist ? psychologistModules : studentModules;

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    welcomeCard: {
      background: 'linear-gradient(135deg, #4a90c4 0%, #357a9e 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '24px',
      marginBottom: '2rem',
      textAlign: 'center' as const,
    },
    welcomeTitle: { fontSize: '1.8rem', fontWeight: '600', marginBottom: '0.25rem' },
    welcomeEmail: { fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' },
    roleBadge: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.2)',
      padding: '0.25rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      border: '1px solid #e2e8f0',
    },
    statIcon: {
      width: '45px',
      height: '45px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.3rem',
    },
    statInfo: { flex: 1 },
    statLabel: { color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' as const },
    statValue: { fontSize: '1.6rem', fontWeight: '700', color: '#1e293b' },
    modulesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginTop: '1rem',
    },
    moduleCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
    },
    moduleIcon: { fontSize: '2rem', marginBottom: '0.8rem' },
    moduleTitle: { fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
    moduleDesc: { color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' },
    moduleButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: '#4f46e5',
      color: 'white',
      borderRadius: '10px',
      fontSize: '0.8rem',
      textDecoration: 'none',
    },
    logoutSection: { marginTop: '2rem', textAlign: 'center' as const },
    studentMessage: { color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem', textAlign: 'center' as const },
  };

  return (
    <div style={styles.container}>
      <div style={styles.welcomeCard}>
        <h1 style={styles.welcomeTitle}>¡Bienvenido, {userName}!</h1>
        <p style={styles.welcomeEmail}>{session.user?.email}</p>
        <span style={styles.roleBadge}>
          {isPsychologist ? "Psicóloga" : "Panel de Estudiantes"}
        </span>
      </div>

      {isPsychologist && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#4a90c415', color: '#4a90c4'}}><FaUsers /></div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Alumnos</div>
              <div style={styles.statValue}>0</div>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div style={styles.studentMessage}>
          📌 Desde aquí puedes acceder a tus módulos.
        </div>
      )}

      <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
        📌 {isPsychologist ? "Módulos de Gestión" : "Mis Módulos"}
      </h2>

      <div style={styles.modulesGrid}>
        {modules.map((m, idx) => (
          <div key={idx} style={styles.moduleCard}>
            <div style={styles.moduleIcon}>{m.icon}</div>
            <h3 style={styles.moduleTitle}>{m.title}</h3>
            <p style={styles.moduleDesc}>{m.desc}</p>
            <Link href={m.link} style={styles.moduleButton}>
              Ir a {m.title} <FaArrowRight size={10} />
            </Link>
          </div>
        ))}
      </div>

      <div style={styles.logoutSection}>
        <LogoutButton />
      </div>
    </div>
  );
}