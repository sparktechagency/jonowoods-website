/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.pixabay.com",
      "images.unsplash.com",
      "i.ibb.co.",
      "10.10.7.37",
      "http://10.10.7.37:7000",
      "rakib.b-cdn.net",
       "10.0.60.126",
       "yoga-app.b-cdn.net"
    ],
  },
  safelist: ["lg:grid-cols-3", "lg:grid-cols-4"],
};

export default nextConfig;
