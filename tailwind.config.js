module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'classes',
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
