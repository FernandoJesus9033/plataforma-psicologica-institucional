"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  FaHome, FaUsers, FaBars, FaTimes, 
  FaCog, FaChartBar, FaCalendarAlt, FaClipboardList, FaBrain,
  FaTasks, FaSignOutAlt, FaFileExcel
} from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";
import { signOut } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { themeStyles, tema } = useTheme();

  const userRole = session?.user?.role;
  const isPsychologist = userRole === "PSYCHOLOGIST";

  // Rutas públicas (sin navbar)
  const publicPages = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicPage = publicPages.includes(pathname);
  const is404Page = pathname === "/404";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', themeStyles.background);
    root.style.setProperty('--text-color', themeStyles.textColor);
    root.style.setProperty('--secondary-text', themeStyles.secondaryText);
    root.style.setProperty('--card-bg', themeStyles.cardBg);
    root.style.setProperty('--border-color', themeStyles.borderColor);
    root.style.setProperty('--navbar-bg', themeStyles.navbarBg);
    root.style.setProperty('--button-primary', themeStyles.buttonPrimary);
    root.style.setProperty('--input-bg', themeStyles.inputBg);
    root.style.setProperty('--input-text', themeStyles.inputText);
    root.style.setProperty('--link-color', themeStyles.linkColor);
    root.style.setProperty('--shadow', themeStyles.shadow);
  }, [themeStyles, tema]);

  const isActive = (path: string) => pathname === path;

  if (isPublicPage || is404Page) return <>{children}</>;
  if (!session || !session.user) return <>{children}</>;

  // Menú para PSICÓLOGA
  const psychologistMenu = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard" },
    { icon: FaUsers, label: "Alumnos", path: "/alumnos" },
    { icon: FaTasks, label: "Actividades", path: "/actividades" },
    { icon: FaClipboardList, label: "Evaluaciones", path: "/evaluaciones" },
    { icon: FaCalendarAlt, label: "Agenda", path: "/agenda" },
    { icon: FaBrain, label: "Resultados Test", path: "/test-resultados" },
    { icon: FaChartBar, label: "Estadísticas", path: "/estadisticas" },
    { icon: FaCog, label: "Configuración", path: "/configuracion" },
  ];

  // Menú para ESTUDIANTE (sin Test Online)
  const studentMenu = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard" },
    { icon: FaFileExcel, label: "Test Psicológico", path: "/test-excel" },
    { icon: FaTasks, label: "Mis Actividades", path: "/mis-actividades" },
    { icon: FaClipboardList, label: "Mis Evaluaciones", path: "/mis-evaluaciones" },
    { icon: FaCalendarAlt, label: "Mis Citas", path: "/mis-citas" },
    { icon: FaCog, label: "Configuración", path: "/configuracion" },
  ];

  const menuItems = isPsychologist ? psychologistMenu : studentMenu;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const styles = {
    container: { minHeight: '100vh', background: 'var(--bg-color)', transition: 'all 0.3s ease' },
    navbar: { background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'sticky' as const, top: 0, zIndex: 1000, borderBottom: '1px solid var(--border-color)' },
    navContainer: { 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: '0.75rem 2rem', 
      display: 'flex', 
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.75rem'
    },
    logo: { 
      fontSize: '1.3rem', 
      fontWeight: '700', 
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
      WebkitBackgroundClip: 'text', 
      WebkitTextFillColor: 'transparent', 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem' 
    },
    desktopMenu: { 
      display: isMobile ? 'none' : 'flex', 
      gap: '0.25rem', 
      alignItems: 'center', 
      flexWrap: 'wrap' as const,
      justifyContent: 'center'
    },
    mobileMenuButton: { display: isMobile ? 'block' : 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--link-color)' },
    link: { 
      color: 'var(--link-color)', 
      textDecoration: 'none', 
      padding: '0.5rem 0.9rem', 
      borderRadius: '40px', 
      transition: 'all 0.2s', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      fontWeight: 500, 
      fontSize: '0.9rem' 
    },
    activeLink: { background: '#4f46e5', color: '#ffffff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' },
    main: { maxWidth: '1280px', margin: '0 auto', padding: '2rem', minHeight: 'calc(100vh - 160px)' },
    footer: { background: 'var(--navbar-bg)', padding: '1rem', textAlign: 'center' as const, marginTop: '2rem', color: 'var(--secondary-text)', fontSize: '0.75rem', borderTop: '1px solid var(--border-color)' },
    mobileMenu: { display: menuOpen ? 'flex' : 'none', flexDirection: 'column' as const, position: 'absolute' as const, top: '100%', left: 0, right: 0, background: 'var(--navbar-bg)', padding: '1rem', gap: '0.5rem', zIndex: 999, borderBottom: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
    logoutButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem 0.9rem', borderRadius: '40px', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link href="/dashboard" style={styles.logo}>
            🧠 Plataforma Psicológica
          </Link>
          <div style={styles.desktopMenu}>
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path} style={{ ...styles.link, ...(isActive(item.path) ? styles.activeLink : {}) }}>
                <item.icon /> {item.label}
              </Link>
            ))}
            <button onClick={handleLogout} style={styles.logoutButton}>
              <FaSignOutAlt /> Salir
            </button>
          </div>
          <button style={styles.mobileMenuButton} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div style={styles.mobileMenu}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} style={styles.link} onClick={() => setMenuOpen(false)}>
              <item.icon /> {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{ ...styles.logoutButton, width: '100%', justifyContent: 'center' }}>
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
      <footer style={styles.footer}>
        <p>© 2026 Plataforma Psicológica - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}