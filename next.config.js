// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const moduleExports = {
  reactStrictMode: true,
  images: {
    domains: [
      'cf-ipfs.com',
      '*.cf-ipfs.com',
      'images.unsplash.com',
      'vitals.vercel-insights.com',
      'google-analytics.com',
      '*.google-analytics.com',
      '*.glitchtip.com',
      'glitchtip.com',
    ],
  },
};

module.exports = moduleExports;
