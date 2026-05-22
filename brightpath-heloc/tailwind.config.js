/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0d1b2a',
          blue: '#2b7cff',
          'blue-light': '#30a2ff',
          'blue-accent': '#77b6e8',
          gray: '#494949',
          'gray-light': '#d9d9d9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
