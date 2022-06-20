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
