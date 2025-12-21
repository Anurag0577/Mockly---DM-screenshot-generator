module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    // Include backend UI components so Tailwind emits classes used for server-side screenshots
    '../backend/src/Platforms-ui/**/*.{js,jsx,ts,tsx}',
  ],
  // Safelist dark:bg-* to be safe for any dynamic/back-end usage
  safelist: [
    { pattern: /^dark:bg-/, variants: [] },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
