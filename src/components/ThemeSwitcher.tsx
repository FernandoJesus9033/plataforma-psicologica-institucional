"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { FaSun, FaMoon, FaDesktop, FaChevronDown } from "react-icons/fa";

export default function ThemeSwitcher() {
  const { theme, setTheme, themeStyles } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "light", label: "Claro", icon: <FaSun /> },
    { value: "dark", label: "Oscuro", icon: <FaMoon /> },
    { value: "system", label: "Sistema", icon: <FaDesktop /> }
  ];

  const currentOption = options.find(opt => opt.value === theme) || options[2];

  const styles = {
    container: { position: 'relative' as const },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: themeStyles.cardBg,
      border: `1px solid ${themeStyles.borderColor}`,
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      color: themeStyles.textColor,
      transition: 'all 0.2s'
    },
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '0.5rem',
      background: themeStyles.cardBg,
      border: `1px solid ${themeStyles.borderColor}`,
      borderRadius: '16px',
      overflow: 'hidden',
      zIndex: 100,
      boxShadow: themeStyles.shadow
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.6rem 1rem',
      cursor: 'pointer',
      fontSize: '0.85rem',
      color: themeStyles.textColor,
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => setIsOpen(!isOpen)}>
        {currentOption.icon} {currentOption.label} <FaChevronDown size={10} />
      </button>
      
      {isOpen && (
        <div style={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              style={{
                ...styles.option,
                background: theme === opt.value ? themeStyles.buttonPrimary + '20' : 'transparent',
                color: theme === opt.value ? themeStyles.buttonPrimary : themeStyles.textColor
              }}
              onClick={() => {
                setTheme(opt.value as "light" | "dark" | "system");
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = themeStyles.buttonPrimary + '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme === opt.value ? themeStyles.buttonPrimary + '20' : 'transparent';
              }}
            >
              {opt.icon} {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}