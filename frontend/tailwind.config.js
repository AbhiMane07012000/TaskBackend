/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1f2937',
        primary: '#3b82f6',
        'primary-dark': '#1e40af',
        secondary: '#10b981',
        'secondary-dark': '#059669',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        muted: '#6b7280',
        border: '#e5e7eb',
      },
      spacing: {
        'gutter': '1rem',
      }
    },
  },
  plugins: [],
}
