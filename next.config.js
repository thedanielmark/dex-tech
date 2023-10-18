/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@uniswap/widgets", "@uniswap/conedison"],
  reactDevOverlay: false,
};

module.exports = nextConfig;
