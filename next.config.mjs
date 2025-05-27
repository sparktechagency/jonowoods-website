/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.pixabay.com",
      "images.unsplash.com",
      "i.ibb.co.",
      "10.0.60.126",
      "rakib.b-cdn.net",
    ],
  },
  safelist: ["lg:grid-cols-3", "lg:grid-cols-4"],
};

export default nextConfig;
