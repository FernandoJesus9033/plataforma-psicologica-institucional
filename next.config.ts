import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},  // ← Esto evita el error local
};

export default nextConfig;