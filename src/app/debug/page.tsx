"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user) {
      fetch("/api/debug/usuarios")
        .then(res => res.json())
        .then(setData)
        .catch(err => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando diagnóstico...</p>
      </div>
    );
  }

  if (session?.user?.role !== "PSYCHOLOGIST") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Acceso no autorizado. Solo psicólogos pueden ver esta página.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem" }}>
        🔍 Diagnóstico de Usuarios
      </h1>
      <p style={{ marginBottom: "1rem", color: "#64748b" }}>
        Total de usuarios en el store: <strong>{data?.total || 0}</strong>
      </p>
      <details style={{ marginBottom: "1rem" }}>
        <summary style={{ cursor: "pointer", color: "#4f46e5" }}>Ver resumen</summary>
        <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#f1f5f9", borderRadius: "8px" }}>
          {data?.usuarios?.map((u: any, i: number) => (
            <div key={i} style={{ padding: "0.25rem 0", borderBottom: "1px solid #e2e8f0" }}>
              <strong>{u.key}</strong> - Rol: {u.role || "sin rol"} - Nombre: {u.name || u.nombre || "sin nombre"}
            </div>
          ))}
        </div>
      </details>
      <pre style={{ 
        background: "#1e293b", 
        color: "#e2e8f0", 
        padding: "1rem", 
        borderRadius: "8px",
        overflowX: "auto",
        fontSize: "12px",
        fontFamily: "monospace"
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}