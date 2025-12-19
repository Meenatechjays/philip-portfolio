/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable the React Compiler for better performance and DX
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add empty turbopack config to silence the warning
  // Webpack config removed - dynamic import with ssr: false handles WASM loading
  turbopack: {},
};

export default nextConfig;


