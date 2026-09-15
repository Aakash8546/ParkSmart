/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0f172a',
        bgCard: '#1e293b',
        bgHover: '#334155',
        brandPrimary: '#3b82f6',
        slotAvailable: '#10b981',
        slotOccupied: '#f43f5e',
        slotReserved: '#f59e0b',
        slotBooking: '#06b6d4',
        accentPurple: '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass-glow': '0 0 30px rgba(59, 130, 246, 0.15)',
        'slot-available': '0 0 20px rgba(16, 185, 129, 0.25)',
        'slot-occupied': '0 0 20px rgba(244, 63, 94, 0.25)',
        'slot-reserved': '0 0 20px rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
}
