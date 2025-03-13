/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  webpack: (config) => {
    // PDF.js worker configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.mjs': require.resolve('pdfjs-dist/build/pdf.mjs'),
      'pdfjs-dist/build/pdf.worker.mjs': require.resolve('pdfjs-dist/build/pdf.worker.mjs'),
    };
    
    return config;
  },
};

export default nextConfig;