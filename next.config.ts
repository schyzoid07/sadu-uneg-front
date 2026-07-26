import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // `npm run build` verifica tipos y lint: si algo falla, el build falla.
  // Antes ambos estaban en `true`, así que el build pasaba con errores de tipos.
};

export default nextConfig;
