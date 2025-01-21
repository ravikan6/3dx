import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React Strict Mode
  swcMinify: true, // Enable SWC minification (Next.js default minifier)
  images: {
    domains: ['example.com'], // Example of adding image domains
  },
  /* Add any other necessary configuration options */
};

export default nextConfig;
