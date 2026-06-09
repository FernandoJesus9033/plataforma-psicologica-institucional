"use client";

import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

interface ToastNotificacionProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export default function ToastNotificacion({
  isOpen,
  onClose,
  message,
  type = "success",
  duration = 3000
}: ToastNotificacionProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle style={{ color: '#10b981', fontSize: '1.2rem' }} />;
      case "error":
        return <FaExclamationCircle style={{ color: '#ef4444', fontSize: '1.2rem' }} />;
      default:
        return <FaInfoCircle style={{ color: '#4f46e5', fontSize: '1.2rem' }} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return '#d1fae5';
      case "error":
        return '#fee2e2';
      default:
        return '#eef2ff';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return '#065f46';
      case "error":
        return '#991b1b';
      default:
        return '#1e3a8a';
    }
  };

  const styles = {
    container: {
      position: 'fixed' as const,
      bottom: '2rem',
      right: '2rem',
      zIndex: 1100,
      animation: 'slideIn 0.3s ease',
    },
    toast: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1.25rem',
      background: getBgColor(),
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: `1px solid ${getTextColor()}20`,
    },
    message: {
      color: getTextColor(),
      fontSize: '0.85rem',
      fontWeight: '500',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: getTextColor(),
      opacity: 0.7,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.toast}>
        {getIcon()}
        <span style={styles.message}>{message}</span>
        <button onClick={onClose} style={styles.closeButton}>
          <FaTimes />
        </button>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}