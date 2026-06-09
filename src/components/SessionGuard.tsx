"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        
        if (!data?.user) {
          router.push("/login");
          return;
        }
        
        setIsValid(true);
      } catch (error) {
        console.error("Error verificando sesión:", error);
        router.push("/login");
      }
    };
    
    checkSession();
    
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [router]);
  
  if (!isValid) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Verificando sesión...</div>
      </div>
    );
  }
  
  return <>{children}</>;
}