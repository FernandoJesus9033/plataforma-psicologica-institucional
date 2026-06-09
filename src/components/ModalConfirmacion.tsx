"use client";

import { FaExclamationTriangle, FaCheck, FaTimes } from "react-icons/fa";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info";
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning"
}: ModalConfirmacionProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <FaTimes style={{ fontSize: '3rem', color: '#ef4444' }} />;
      case "info":
        return <FaCheck style={{ fontSize: '3rem', color: '#4f46e5' }} />;
      default:
        return <FaExclamationTriangle style={{ fontSize: '3rem', color: '#f59e0b' }} />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case "danger":
        return { background: '#ef4444' };
      case "info":
        return { background: '#4f46e5' };
      default:
        return { background: '#f59e0b' };
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
    },
    iconContainer: {
      marginBottom: '1rem',
    },
    title: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    message: {
      color: '#64748b',
      marginBottom: '1.5rem',
      lineHeight: '1.5',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
    },
    confirmButton: {
      flex: 1,
      padding: '0.75rem',
      ...getButtonStyle(),
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    cancelButton: {
      flex: 1,
      padding: '0.75rem',
      background: '#e2e8f0',
      color: '#475569',
      border: 'none',
      borderRadius: '40px',
      cursor: 'pointer',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconContainer}>{getIcon()}</div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonGroup}>
          <button onClick={onClose} style={styles.cancelButton}>{cancelText}</button>
          <button onClick={onConfirm} style={styles.confirmButton}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}