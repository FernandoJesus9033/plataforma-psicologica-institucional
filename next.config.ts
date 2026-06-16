import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,  // ✅ AHORA NO IGNORA ERRORES
  },
};

export default nextConfig;