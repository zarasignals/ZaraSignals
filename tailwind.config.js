/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zara': {
          'primary': '#888888',
          'secondary': '#666666',
          'accent': '#aaaaaa',
          'warning': '#999999',
          'danger': '#777777',
          'dark': '#0a0a0a',
          'darker': '#050505',
          'card': '#141414',
          'border': '#2a2a2a',
          'grey': '#1a1a1a',
          'light-grey': '#3a3a3a'
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'typing': 'typing 3s steps(40, end)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,255,255,0.2), 0 0 10px rgba(255,255,255,0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
