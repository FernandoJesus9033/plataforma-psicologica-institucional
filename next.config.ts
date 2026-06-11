import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},  // ← Evita el error local
  typescript: {
    ignoreBuildErrors: true,  // ← Ignora errores de TypeScript en el build
  },
};

export default nextConfig;