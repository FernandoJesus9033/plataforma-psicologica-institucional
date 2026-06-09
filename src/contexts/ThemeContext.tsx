"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themeStyles: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // Resolver tema real
    let resolved: "light" | "dark";
    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = theme;
    }
    setResolvedTheme(resolved);
  }, [theme]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const newResolved = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(newResolved);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const themeStyles = {
    isDark: resolvedTheme === "dark",
    background: resolvedTheme === "dark" ? "#0f172a" : "#f1f5f9",
    textColor: resolvedTheme === "dark" ? "#f8fafc" : "#0f172a",
    secondaryText: resolvedTheme === "dark" ? "#94a3b8" : "#475569",
    cardBg: resolvedTheme === "dark" ? "#1e293b" : "#ffffff",
    borderColor: resolvedTheme === "dark" ? "#334155" : "#e2e8f0",
    navbarBg: resolvedTheme === "dark" ? "#1e293b" : "#ffffff",
    buttonPrimary: "#4f46e5",
    inputBg: resolvedTheme === "dark" ? "#334155" : "#ffffff",
    inputText: resolvedTheme === "dark" ? "#f8fafc" : "#0f172a",
    linkColor: resolvedTheme === "dark" ? "#a5b4fc" : "#4f46e5",
    shadow: resolvedTheme === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)",
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}