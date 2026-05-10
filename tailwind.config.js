/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@aegov/design-system-react/dist/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 12px 35px rgba(24, 35, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
