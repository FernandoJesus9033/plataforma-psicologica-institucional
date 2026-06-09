"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUsers, FaClipboardList, FaCalendarAlt, FaBrain, FaShieldAlt, FaChartLine, FaArrowRight, FaHeart, FaSmile, FaHandHoldingHeart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const styles = {
    container: { minHeight: '100vh', background: '#f0f4f8' },
    
    navbar: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      padding: scrolled ? '0.8rem 3rem' : '1rem 3rem',
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'white',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : '0 2px 10px rgba(0,0,0,0.03)',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '1rem'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    logoIcon: { 
      fontSize: '2rem'
    },
    logoText: { 
      fontSize: '1.3rem', 
      fontWeight: '700', 
      color: '#2c3e50',
      background: 'linear-gradient(135deg, #4a90c4, #6ba3d6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    navIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    navIconItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.2rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    navIcon: { fontSize: '1.3rem' },
    navIconLabel: { fontSize: '0.65rem', color: '#94a3b8', fontWeight: '500' },
    
    hero: {
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
      padding: '6rem 2rem 4rem',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    floatingIcons: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none' as const
    },
    heroContent: { maxWidth: '800px', margin: '0 auto', zIndex: 2, position: 'relative' as const },
    heroTitle: { 
      fontSize: '3.5rem', 
      fontWeight: '700', 
      color: '#1e293b',
      marginBottom: '1rem', 
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #1e293b, #4a90c4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    heroSubtitle: { fontSize: '1.2rem', color: '#5a6c7e', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' },
    buttonGroup: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' as const },
    primaryButton: { 
      padding: '0.9rem 2.2rem', 
      borderRadius: '50px', 
      background: 'linear-gradient(135deg, #4a90c4, #6ba3d6)', 
      color: 'white', 
      textDecoration: 'none', 
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s',
      boxShadow: '0 4px 14px rgba(74,144,196,0.3)'
    },
    secondaryButton: { 
      padding: '0.9rem 2.2rem', 
      borderRadius: '50px', 
      background: 'transparent', 
      border: '2px solid #4a90c4', 
      color: '#4a90c4', 
      textDecoration: 'none', 
      fontWeight: '600',
      transition: 'all 0.3s'
    },
    
    statsSection: { 
      background: 'rgba(255,255,255,0.7)', 
      backdropFilter: 'blur(10px)',
      padding: '3rem 2rem',
      margin: '0 2rem 2rem',
      borderRadius: '32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
    },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' },
    statCard: { textAlign: 'center' as const, padding: '1rem' },
    statNumber: { fontSize: '2.2rem', fontWeight: '700', color: '#4a90c4' },
    statLabel: { color: '#7f8c8d', fontSize: '0.85rem', marginTop: '0.5rem' },
    
    featuresSection: { background: '#f8fafc', padding: '4rem 2rem', textAlign: 'center' as const },
    featuresTitle: { fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' },
    featuresSubtitle: { color: '#7f8c8d', marginBottom: '2rem', fontSize: '1rem' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' },
    featureCard: { 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '20px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      textAlign: 'center' as const,
      transition: 'all 0.3s'
    },
    featureIcon: { fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' },
    featureTitle: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
    featureDesc: { color: '#7f8c8d', fontSize: '0.8rem', lineHeight: 1.4 },
    
    ctaSection: { background: 'linear-gradient(135deg, #4a90c4, #6ba3d6)', padding: '3rem 2rem', textAlign: 'center' as const, color: 'white' },
    ctaTitle: { fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' },
    ctaSubtitle: { fontSize: '1rem', opacity: 0.9, marginBottom: '1.5rem' },
    ctaButton: { 
      padding: '0.8rem 2rem', 
      borderRadius: '50px', 
      background: 'white', 
      color: '#4a90c4', 
      textDecoration: 'none', 
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s'
    },
    
    footer: { background: '#1e293b', padding: '1.5rem', textAlign: 'center' as const, color: '#94a3b8', fontSize: '0.75rem' }
  };

  const features = [
    { icon: <FaBrain style={{ color: '#4a90c4' }} />, title: "Test Psicológico", desc: "Evaluación completa de personalidad Gordon P-IPG" },
    { icon: <FaClipboardList style={{ color: '#10b981' }} />, title: "Evaluaciones", desc: "Registro y seguimiento con semáforo de estado" },
    { icon: <FaCalendarAlt style={{ color: '#f59e0b' }} />, title: "Agenda de Citas", desc: "Programación y gestión de consultas" },
    { icon: <FaUsers style={{ color: '#8b5cf6' }} />, title: "Gestión de Alumnos", desc: "Administración completa de estudiantes" },
    { icon: <FaChartLine style={{ color: '#ef4444' }} />, title: "Estadísticas", desc: "Reportes y análisis de rendimiento" },
    { icon: <FaShieldAlt style={{ color: '#06b6d4' }} />, title: "Seguridad", desc: "Datos protegidos con altos estándares" }
  ];

  const navIcons = [
    { icon: <FaHeart />, label: "Bienestar", color: "#ef4444" },
    { icon: <FaSmile />, label: "Empatía", color: "#f59e0b" },
    { icon: <FaHandHoldingHeart />, label: "Confianza", color: "#10b981" }
  ];

  const floatingIconsList = [
    { icon: "🧠", x: "10%", y: "15%", delay: 0, duration: 3 },
    { icon: "❤️", x: "85%", y: "20%", delay: 0.5, duration: 4 },
    { icon: "🌿", x: "15%", y: "70%", delay: 1, duration: 3.5 },
    { icon: "🕊️", x: "90%", y: "75%", delay: 1.5, duration: 4.5 },
    { icon: "✨", x: "50%", y: "85%", delay: 2, duration: 3 },
    { icon: "⭐", x: "5%", y: "45%", delay: 2.5, duration: 3.8 },
    { icon: "🌸", x: "95%", y: "50%", delay: 3, duration: 4.2 },
    { icon: "🦋", x: "20%", y: "85%", delay: 3.5, duration: 3.2 }
  ];

  // Si no está montado, mostrar un loader simple
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4a90c4', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={styles.container} suppressHydrationWarning>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={styles.logoIcon}
          >
            🧠
          </motion.div>
          <span style={styles.logoText}>Plataforma Psicológica</span>
        </div>
        
        <div style={styles.navIcons}>
          {navIcons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.1 }}
              style={styles.navIconItem}
            >
              <div style={{ ...styles.navIcon, color: item.color }}>{item.icon}</div>
              <span style={styles.navIconLabel}>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.floatingIcons}>
          {floatingIconsList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.2, y: [0, -15, 0] }}
              transition={{ delay: item.delay, duration: item.duration, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                fontSize: '2rem',
                pointerEvents: 'none'
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
        
        <div style={styles.heroContent}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={styles.heroTitle}
          >
            Bienestar y <br />Crecimiento Emocional
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={styles.heroSubtitle}
          >
            Plataforma integral para la gestión psicológica. Administra alumnos, evaluaciones y citas de manera eficiente y profesional.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={styles.buttonGroup}
          >
            <Link href="/login" style={styles.primaryButton}>
              Iniciar Sesión <FaArrowRight size={12} />
            </Link>
            <Link href="/register" style={styles.secondaryButton}>
              Crear Cuenta
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>100+</div>
            <div style={styles.statLabel}>Alumnos Activos</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>50+</div>
            <div style={styles.statLabel}>Evaluaciones</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>30+</div>
            <div style={styles.statLabel}>Citas Mensuales</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>Satisfacción</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <h2 style={styles.featuresTitle}>¿Qué ofrecemos?</h2>
        <p style={styles.featuresSubtitle}>Herramientas diseñadas para profesionales de la psicología</p>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
              style={styles.featureCard}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>¿Listo para comenzar?</h2>
        <p style={styles.ctaSubtitle}>Únete a nuestra plataforma y mejora la gestión de tus pacientes</p>
        <Link href="/register" style={styles.ctaButton}>
          Crear Cuenta Gratis <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Plataforma Psicológica - Todos los derechos reservados</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>Desarrollado para la gestión institucional</p>
      </footer>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}