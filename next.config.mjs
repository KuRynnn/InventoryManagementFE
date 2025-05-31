/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan basePath untuk handle reverse proxy
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/fe', // This is correct and crucial

  // For development with HMR through proxy (if you're using it in dev)
  async rewrites() {
    return [
      {
        source: '/fe/.next/:path*',
        destination: '/.next/:path*', // This rewrite is specifically for HMR in dev and relies on the Nginx rewrite.
                                     // With the proposed Nginx change, this rewrite might become less critical
                                     // or even slightly redundant depending on specific Next.js internal logic.
                                     // Keep it for now, it generally doesn't harm.
      },
    ];
  },

  // Pastikan asset prefix sesuai
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
    : '', // This is also correct
};

export default nextConfig;