/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lumora/shared-types', '@lumora/validation', '@lumora/api-client']
};

export default nextConfig;
