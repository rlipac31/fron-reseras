import type { NextConfig } from "next";

const nextConfig = {
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


