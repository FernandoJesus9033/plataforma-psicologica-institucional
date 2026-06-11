import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "PSYCHOLOGIST" | "STUDENT" | string | null;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "PSYCHOLOGIST" | "STUDENT" | string | null;
    };
  }
}