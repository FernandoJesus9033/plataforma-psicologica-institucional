import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import { 
  FaTasks, FaClipboardList, FaCalendarAlt, FaCog, FaArrowRight, FaFileExcel, FaUsers
} from "react-icons/fa";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  const isPsychologist = user?.role === "PSYCHOLOGIST";
  const isStudent = user?.role === "STUDENT";

  const totalAlumnos = await prisma.student.count();
  const totalEvaluaciones = await prisma.evaluation.count();
  const totalCitas = await prisma.appointment.count();

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },

    welcomeCard: {
      background: 'linear-gradient(135deg, #4a90c4 0%, #357a9e 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '24px',
      marginBottom: '2rem',
      textAlign: 'center' as const,
      boxShadow: '0 10px 25px rgba(74, 144, 196, 0.2)',
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
      background: 'var(--card-bg)',
      borderRadius: '16px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      border: '1px solid var(--border-color)',
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
    statLabel: { color: 'var(--secondary-text)', fontSize: '0.7rem', textTransform: 'uppercase' as const },
    statValue: { fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-color)' },

    modulesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginTop: '1rem',
    },
    moduleCard: {
      background: 'var(--card-bg)',
      borderRadius: '20px',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow)',
    },
    moduleIcon: { fontSize: '2rem', marginBottom: '0.8rem' },
    moduleTitle: { fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.5rem' },
    moduleDesc: { color: 'var(--secondary-text)', fontSize: '0.85rem', marginBottom: '1rem' },
    moduleButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'var(--button-primary)',
      color: 'white',
      borderRadius: '10px',
      fontSize: '0.8rem',
      textDecoration: 'none',
    },

    logoutSection: { marginTop: '2rem', textAlign: 'center' as const },
    studentMessage: { color: 'var(--secondary-text)', marginBottom: '1.5rem', fontSize: '0.95rem', textAlign: 'center' as const },
  };

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

  return (
    <div style={styles.container}>
      <div style={styles.welcomeCard}>
        <h1 style={styles.welcomeTitle}>¡Bienvenido, {user?.name || "Usuario"}!</h1>
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
              <div style={styles.statValue}>{totalAlumnos}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#48bb7815', color: '#48bb78'}}><FaClipboardList /></div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Evaluaciones</div>
              <div style={styles.statValue}>{totalEvaluaciones}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#f59e0b15', color: '#f59e0b'}}><FaCalendarAlt /></div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Citas</div>
              <div style={styles.statValue}>{totalCitas}</div>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div style={styles.studentMessage}>
          📌 Desde aquí puedes acceder a tus módulos.
        </div>
      )}

      <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '1rem' }}>
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