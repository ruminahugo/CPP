/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // Với Next.js 13+ (app router)
      "./components/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",  // Với Next.js 12 (pages router)
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  