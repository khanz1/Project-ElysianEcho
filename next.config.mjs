/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firefly.adobe.com",
      }
    ]
  }
};

export default nextConfig;
