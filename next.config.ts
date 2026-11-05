import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Todas as imagens já usam `unoptimized`. Desligar o otimizador fecha o
  // endpoint /_next/image, que gastaria a cota de transformações do Hobby.
  images: { unoptimized: true },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
