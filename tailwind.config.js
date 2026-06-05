/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // BrightPath brand palette
        brand: {
          navy:    '#0d1b2a',   // logo "bright" dark navy
          blue:    '#77b6e8',   // logo "path" light blue
          gray:    '#d9d9d9',   // logo "Finance" / divider gray
        },
        primary: {
          50:  '#eef5ff',
          100: '#ddeaff',
          200: '#bbd5ff',
          300: '#85b8ff',
          400: '#30a2ff',  // brand light blue
          500: '#2b7cff',  // brand primary blue
          600: '#1a63e8',
          700: '#1450cc',
          800: '#0d1b2a',  // brand navy (reuse)
          900: '#091424',
        },
        neutral: {
          50:  '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#494949',  // brand dark text
          800: '#343a40',
          900: '#212529',
        },
        accent: {
          50:  '#e8f4fd',
          100: '#c9e6fa',
          200: '#9dd0f6',
          300: '#77b6e8',  // brand light blue
          400: '#30a2ff',
          500: '#2b7cff',
          600: '#1a63e8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #1e4d8c 100%)',
        'blue-gradient':  'linear-gradient(135deg, #2b7cff 0%, #30a2ff 100%)',
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(43, 124, 255, 0.18)',
        'card':  '0 2px 12px rgba(13, 27, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
