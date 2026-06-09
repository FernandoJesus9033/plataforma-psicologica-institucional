import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SessionCheck({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: "PSYCHOLOGIST" | "STUDENT";
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");
  }
  
  if (requiredRole && session.user?.role !== requiredRole) {
    redirect("/dashboard");
  }
  
  return <>{children}</>;
}