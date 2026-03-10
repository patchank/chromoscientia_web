/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@chromoscientia/game-core", "@chromoscientia/shared"],
};

module.exports = nextConfig;
