const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(input|form).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}

