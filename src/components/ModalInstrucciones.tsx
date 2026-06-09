"use client";

import { useState } from "react";
import { FaHeart, FaCheck, FaTimes, FaClipboardList, FaUserFriends, FaSave, FaSmile } from "react-icons/fa";

interface ModalInstruccionesProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalInstrucciones({ isOpen, onClose, onConfirm }: ModalInstruccionesProps) {
  const [instruccionesLeidas, setInstruccionesLeidas] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(44, 62, 80, 0.85)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '32px',
        maxWidth: '550px',
        width: '90%',
        maxHeight: '85vh',
        overflow: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        border: '1px solid rgba(74, 144, 196, 0.2)'
      }}>
        {/* Header con icono decorativo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4a90c4, #6ba3d6)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaHeart style={{ fontSize: '1.8rem', color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#2c3e50',
              margin: 0
            }}>
              Test de Personalidad
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: '#7f8c8d',
              margin: '0.25rem 0 0 0'
            }}>
              Gordon Personal Profile Inventory (P-IPG)
            </p>
          </div>
        </div>

        {/* Información del test */}
        <div style={{
          background: '#eef2f7',
          borderRadius: '20px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#4a90c4' }}>33</div>
            <div style={{ fontSize: '0.75rem', color: '#5a6c7e' }}>Grupos</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#4a90c4' }}>4</div>
            <div style={{ fontSize: '0.75rem', color: '#5a6c7e' }}>Afirmaciones por grupo</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#4a90c4' }}>15</div>
            <div style={{ fontSize: '0.75rem', color: '#5a6c7e' }}>minutos</div>
          </div>
        </div>

        {/* Instrucciones */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaClipboardList style={{ color: '#4a90c4' }} /> Instrucciones
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                background: '#d4e8f7',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <span style={{ color: '#4a90c4', fontWeight: 'bold' }}>1</span>
              </div>
              <p style={{ color: '#2c3e50', margin: 0, lineHeight: '1.4' }}>
                <strong>33 grupos</strong> con 4 afirmaciones cada uno.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                background: '#d4f0e8',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <FaSmile style={{ color: '#10b981', fontSize: '0.8rem' }} />
              </div>
              <p style={{ color: '#2c3e50', margin: 0, lineHeight: '1.4' }}>
                <strong style={{ color: '#10b981' }}>🔵 MÁS parecido:</strong> Selecciona la afirmación que mejor te describe.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                background: '#fde8e8',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>✗</span>
              </div>
              <p style={{ color: '#2c3e50', margin: 0, lineHeight: '1.4' }}>
                <strong style={{ color: '#ef4444' }}>🔴 MENOS parecido:</strong> Selecciona la afirmación que menos te describe.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                background: '#fff4e0',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <FaUserFriends style={{ color: '#f59e0b', fontSize: '0.8rem' }} />
              </div>
              <p style={{ color: '#2c3e50', margin: 0, lineHeight: '1.4' }}>
                <strong>Importante:</strong> No puedes seleccionar la misma afirmación para ambas opciones.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                background: '#e8eef5',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <FaSave style={{ color: '#6ba3d6', fontSize: '0.8rem' }} />
              </div>
              <p style={{ color: '#2c3e50', margin: 0, lineHeight: '1.4' }}>
                <strong>Puedes guardar tu progreso</strong> y continuar después.
              </p>
            </div>
          </div>
        </div>

        {/* Recomendación */}
        <div style={{
          background: '#fef3e2',
          borderRadius: '16px',
          padding: '0.8rem 1rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e' }}>
            ✨ <strong>Consejo:</strong> Responde con sinceridad. No hay respuestas correctas o incorrectas. Lo importante es conocerte mejor.
          </p>
        </div>

        {/* Checkbox */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.75rem',
            background: instruccionesLeidas ? '#e8f4ea' : '#f8f9fa',
            borderRadius: '16px',
            transition: 'all 0.2s ease'
          }}>
            <input
              type="checkbox"
              checked={instruccionesLeidas}
              onChange={(e) => setInstruccionesLeidas(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: '#10b981'
              }}
            />
            <span style={{ color: '#2c3e50', fontWeight: instruccionesLeidas ? '500' : 'normal' }}>
              <FaCheck style={{ display: 'inline', marginRight: '0.5rem', color: '#10b981' }} />
              He leído y comprendido las instrucciones
            </span>
          </label>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '40px',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            <FaTimes /> Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!instruccionesLeidas}
            style={{
              padding: '0.8rem 1.8rem',
              borderRadius: '40px',
              border: 'none',
              background: instruccionesLeidas ? 'linear-gradient(135deg, #4a90c4, #6ba3d6)' : '#cbd5e1',
              color: 'white',
              cursor: instruccionesLeidas ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transform: instruccionesLeidas ? 'scale(1)' : 'scale(0.98)'
            }}
          >
            <FaHeart /> Comenzar test
          </button>
        </div>
      </div>
    </div>
  );
}