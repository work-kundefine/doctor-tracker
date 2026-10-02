/** @type {import('next').NextConfig} */
const backendHost = process.env.BACKEND_API_URL || 'http://backend:5000';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendHost}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
