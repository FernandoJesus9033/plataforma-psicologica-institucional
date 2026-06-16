import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 [authorize] Intentando autorizar:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [authorize] Faltan credenciales");
          return null;
        }

        // ✅ AHORA USA PRISMA en lugar de Netlify Blobs
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) {
          console.log("❌ [authorize] Usuario no encontrado:", credentials.email);
          return null;
        }
        
        console.log("📦 [authorize] Usuario encontrado:", { email: user.email, role: user.role });
        
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!passwordMatch) {
          console.log("❌ [authorize] Contraseña incorrecta para:", credentials.email);
          return null;
        }

        console.log("✅ [authorize] Autorización exitosa para:", credentials.email);
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "STUDENT"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔑 [jwt] Token antes:", { id: token.id, role: token.role });
      
      if (user) {
        token.id = user.id;
        token.role = user.role || "STUDENT";
        console.log("✅ [jwt] Token actualizado con usuario:", { id: user.id, role: user.role });
      }
      
      if (token.role) {
        console.log("🔑 [jwt] Rol en token:", token.role);
      }
      
      console.log("🔑 [jwt] Token después:", { id: token.id, role: token.role });
      return token;
    },
    async session({ session, token }) {
      console.log("📋 [session] Session antes:", { user: session.user });
      
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "STUDENT";
        console.log("✅ [session] Session actualizada con token:", { id: token.id, role: token.role });
      }
      
      console.log("📋 [session] Session después:", { user: session.user });
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };