/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',  // Darker blue
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
      },
      fontFamily: {
        sans: ['"WF Visual Sans"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.375rem',    // 6px
        DEFAULT: '0.5rem',   // 8px
        'md': '0.75rem',     // 12px
        'lg': '1rem',        // 16px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
      },
      spacing: {
        'xs': '0.5rem',      // 8px
        'sm': '0.75rem',     // 12px
        'md': '1rem',        // 16px
        'lg': '1.5rem',      // 24px
        'xl': '2rem',        // 32px
        '2xl': '2.5rem',     // 40px
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
    },
  },
  plugins: [],
} 