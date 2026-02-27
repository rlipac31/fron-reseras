import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        // Cuando llames a /api-backend/..., Next.js lo enviará a Koyeb por debajo
        source: '/api-backend/:path*',
        destination: 'https://reserva-campos.onrender.com/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://reserva-campos.onrender.com/',
        port: '',
        pathname: '/imagenes/**',
      },
      {
        protocol: 'https',
        hostname: 'https://reserva-campos.onrender.com/**', // Uso de comodines
      },
    ],
  },


};

export default nextConfig;


