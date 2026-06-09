"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaHome, FaUsers, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaCog, FaChartBar, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";

export default function LayoutClient({ children, session }: any) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { themeStyles } = useTheme();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => pathname === path;

  const styles = {
    container: {
      minHeight: '100vh',
      background: themeStyles.background,
      color: themeStyles.textColor,
      transition: 'all 0.3s ease',
    },
    navbar: {
      background: themeStyles.navbarBg,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1000,
    },
    navContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #0891b2, #0e7f9e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none',
    },
    desktopMenu: {
      display: isMobile ? 'none' : 'flex',
      gap: '1.5rem',
      alignItems: 'center',
    },
    mobileMenuButton: {
      display: isMobile ? 'block' : 'none',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: themeStyles.linkColor,
    },
    link: {
      color: themeStyles.linkColor,
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: 500,
    },
    activeLink: {
      background: themeStyles.buttonPrimary,
      color: '#ffffff',
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem',
    },
    footer: {
      background: themeStyles.navbarBg,
      padding: '2rem',
      textAlign: 'center' as const,
      marginTop: '4rem',
      color: themeStyles.secondaryText,
    },
    mobileMenu: {
      display: menuOpen ? 'flex' : 'none',
      flexDirection: 'column' as const,
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      background: themeStyles.navbarBg,
      padding: '1rem',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      gap: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>
            🧠 Plataforma Psicológica
          </Link>
          <div style={styles.desktopMenu}>
            <Link href="/" style={{...styles.link, ...(isActive('/') ? styles.activeLink : {})}}><FaHome /> Inicio</Link>
            {session ? (
              <>
                <Link href="/dashboard" style={{...styles.link, ...(isActive('/dashboard') ? styles.activeLink : {})}}><FaUsers /> Dashboard</Link>
                <Link href="/alumnos" style={{...styles.link, ...(isActive('/alumnos') ? styles.activeLink : {})}}><FaUsers /> Alumnos</Link>
                <Link href="/evaluaciones" style={{...styles.link, ...(isActive('/evaluaciones') ? styles.activeLink : {})}}><FaClipboardList /> Evaluaciones</Link>
                <Link href="/agenda" style={{...styles.link, ...(isActive('/agenda') ? styles.activeLink : {})}}><FaCalendarAlt /> Agenda</Link>
                <Link href="/estadisticas" style={{...styles.link, ...(isActive('/estadisticas') ? styles.activeLink : {})}}><FaChartBar /> Estadísticas</Link>
                <Link href="/configuracion" style={{...styles.link, ...(isActive('/configuracion') ? styles.activeLink : {})}}><FaCog /> Configuración</Link>
              </>
            ) : (
              <>
                <Link href="/login" style={{...styles.link, ...(isActive('/login') ? styles.activeLink : {})}}><FaSignInAlt /> Login</Link>
                <Link href="/register" style={{...styles.link, ...(isActive('/register') ? styles.activeLink : {})}}><FaUserPlus /> Registro</Link>
              </>
            )}
          </div>
          <button style={styles.mobileMenuButton} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div style={styles.mobileMenu}>
          <Link href="/" style={styles.link} onClick={() => setMenuOpen(false)}>Inicio</Link>
          {session ? (
            <>
              <Link href="/dashboard" style={styles.link} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/alumnos" style={styles.link} onClick={() => setMenuOpen(false)}>Alumnos</Link>
              <Link href="/evaluaciones" style={styles.link} onClick={() => setMenuOpen(false)}>Evaluaciones</Link>
              <Link href="/agenda" style={styles.link} onClick={() => setMenuOpen(false)}>Agenda</Link>
              <Link href="/estadisticas" style={styles.link} onClick={() => setMenuOpen(false)}>Estadísticas</Link>
              <Link href="/configuracion" style={styles.link} onClick={() => setMenuOpen(false)}>Configuración</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.link} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" style={styles.link} onClick={() => setMenuOpen(false)}>Registro</Link>
            </>
          )}
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
      <footer style={styles.footer}>
        <p>© 2026 Plataforma Psicológica - Todos los derechos reservados</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Desarrollado para la gestión institucional</p>
      </footer>
    </div>
  );
}