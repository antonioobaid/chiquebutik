/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // Lägg till denna om du använder pages-mapp
    "./src/**/*.{js,ts,jsx,tsx}"    // Lägg till denna om du använder src-mapp
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#ffe4f2',
          500: '#ec4899',
          600: '#db2777',
        },
        blue: {
          50: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}