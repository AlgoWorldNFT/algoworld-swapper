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
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

if (process.env.CI) {
  module.exports = moduleExports;
} else {
  const { withSentryConfig } = require('@sentry/nextjs');

  const sentryWebpackPluginOptions = {
    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
  };

  // Make sure adding Sentry options is the last code to run before exporting, to
  // ensure that your source maps include changes from all other Webpack plugins
  module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
}
