/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const nextJest = require(`next/jest`);

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: `./`,
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  preset: `ts-jest`,
  roots: [`<rootDir>/src/`],
  setupFilesAfterEnv: [`<rootDir>/jest.setup.js`],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': `<rootDir>/src/$1`,
  },
  testPathIgnorePatterns: [
    `<rootDir>/.vercel`,
    '/__fixtures__/',
    '/__utils__/',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/redux/theme/',
    '_app.page.tsx',
    '_document.page.tsx',
    'constants.ts',
  ],
  testEnvironment: `jest-environment-jsdom`,
  collectCoverageFrom: [`**/*.{ts,tsx}`],
  coverageReporters: ['text', 'cobertura'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
