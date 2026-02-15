import type { NextConfig } from "next";

const nextConfig = {
   async rewrites() {
    return [
      {
        // Cuando llames a /api-backend/..., Next.js lo enviará a Koyeb por debajo
        source: '/api-backend/:path*',
        destination: 'https://wrong-mame-rlipac-497028fb.koyeb.app/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://wrong-mame-rlipac-497028fb.koyeb.app/',
        port: '',
        pathname: '/imagenes/**',
      },
      {
        protocol: 'https',
        hostname: 'https://wrong-mame-rlipac-497028fb.koyeb.app/**', // Uso de comodines
      },
    ],
  },


};

export default nextConfig;


