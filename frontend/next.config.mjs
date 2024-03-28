import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Documentation for making @svgr/webpack work with NextJS here: https://react-svgr.com/docs/next/
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src', 'styles')],
  },
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/form',
      '@mantine/notifications',
      '@mantine/modals',
      '@mantine/nprogress'
    ],
  },
  output: 'standalone',
};

export default nextConfig;
