/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.wikimedia.org" },
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "assets.adidas.com" },
      { protocol: "https", hostname: "nb.scene7.com" },
    ],
  },
};

export default nextConfig;
