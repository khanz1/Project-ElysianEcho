/** @type {import('next').NextConfig} */
// https://lh3.googleusercontent.com/a/ACg8ocKcyz92WWkt8rZ6nQXQXJ0t0tBPSeiOTmVkvk16UgM_wmq2fko=s96-c
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'firebasestorage.googleapis.com',
        protocol: 'https',
      }
    ]
  }
};

export default nextConfig;
