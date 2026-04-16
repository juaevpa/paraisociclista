/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1979e6',
          600: '#1565c0',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e7edf3',
          300: '#d0dbe7',
          400: '#94a3b8',
          500: '#4e7097',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0e141b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
