/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Velké lokální složky (data/, figma exporty) jinak zaplní file watchery → EMFILE
      // a dev server začne vracet 404 na /_next/static/* (rozbité styly a JS).
      // Nepřidávej sem regex z původního ignored — webpack multi-config pak padne na validaci.
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/data/**",
          "**/figma-404/**",
          "**/figma-seed/**",
          "**/*.zip",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
