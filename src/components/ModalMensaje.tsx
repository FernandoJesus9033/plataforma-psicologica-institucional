"use client";

import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

interface ModalMensajeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
}

export default function ModalMensaje({ isOpen, onClose, title, message, type = "success" }: ModalMensajeProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle style={{ fontSize: '3rem', color: '#10b981' }} />;
      case "error":
        return <FaTimesCircle style={{ fontSize: '3rem', color: '#ef4444' }} />;
      default:
        return <FaInfoCircle style={{ fontSize: '3rem', color: '#4a90c4' }} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return '#10b98115';
      case "error":
        return '#ef444415';
      default:
        return '#4a90c415';
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: 'white',
      borderRadius: '24px',
      maxWidth: '400px',
      width: '90%',
      padding: '2rem',
      textAlign: 'center' as const,
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.2s ease',
    },
    iconContainer: {
      background: getBgColor(),
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem auto',
    },
    title: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '0.5rem',
    },
    message: {
      color: '#64748b',
      marginBottom: '1.5rem',
      lineHeight: '1.5',
    },
    button: {
      padding: '0.8rem 2rem',
      borderRadius: '40px',
      border: 'none',
      background: type === "success" ? '#10b981' : type === "error" ? '#ef4444' : '#4a90c4',
      color: 'white',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
    },
    buttonHover: {
      opacity: 0.9,
      transform: 'scale(1.02)',
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconContainer}>
          {getIcon()}
        </div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <button
          style={styles.button}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}