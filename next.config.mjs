import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
