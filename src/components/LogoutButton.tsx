"use client";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.8rem 1.5rem',
        background: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <FaSignOutAlt /> Cerrar Sesión
    </button>
  );
}