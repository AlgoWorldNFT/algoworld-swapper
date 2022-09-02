// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const moduleExports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  images: {
    domains: [
      'dweb.link',
      '*.dweb.link',
      'images.unsplash.com',
      'vitals.vercel-insights.com',
      'google-analytics.com',
      '*.google-analytics.com',
      '*.glitchtip.com',
      'glitchtip.com',
    ],
  },
};

module.exports = withPWA({
  ...moduleExports,
  pwa: { dest: 'public', runtimeCaching },
});
