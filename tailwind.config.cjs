/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0d',
        surface: '#0f1720',
        accent: '#2563EB',
        muted: '#94a3b8'
      },
      backgroundImage: {
        'grid-texture': "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)"
      },
      boxShadow: {
        soft: '0 6px 18px rgba(2,6,23,0.6)',
        thin: '0 1px 0 rgba(255,255,255,0.02)'
      }
    }
  },
  plugins: []
}
