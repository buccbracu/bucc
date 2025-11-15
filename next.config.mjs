/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
};

export default nextConfig;
