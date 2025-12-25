/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.pixabay.com",
      "images.unsplash.com",
      "i.ibb.co",
      "10.10.7.48",
      "rakib.b-cdn.net",
      "10.0.60.126",
      "yoga-app.b-cdn.net",
      "69.62.67.86",
      "api.yogawithjen.life",
      "web.yogawithjen.life",
      "yoga-with-jen-app.b-cdn.net"
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
