// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
});

const plugins = [];

plugins.push(withPWA);

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  images: {
    domains: [
      'ipfs.algonode.xyz',
      'cf-ipfs.com',
      'dweb.link',
      'cloudflare-ipfs.com',
      'ipfs-gateway.cloud',
      '*.nf.domains',
      'images.nf.domains',

      'images.unsplash.com',
      'vitals.vercel-insights.com',
      'google-analytics.com',
      '*.google-analytics.com',
      'gist.githubusercontent.com',
    ],
  },
};

module.exports = () => plugins.reduce((acc, next) => next(acc), nextConfig);
