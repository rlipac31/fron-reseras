

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // En local y producción, esto redirige las llamadas
        source: '/api-backend/:path*',
        destination: 'https://reserva-campos.onrender.com/api/:path*',
      },
    ];
  },
  // Corregimos los remotePatterns para que no fallen
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'reserva-campos.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
