/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add support for GLTF/GLB 3D model files
    config.module.rules.push({
      test: /\.(gltf|glb)$/,
      type: 'asset/resource',
    });
    return config;
  },
  // Enable static export optimization
  output: 'standalone',
};

export default nextConfig;
