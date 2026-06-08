/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral:  { DEFAULT: '#FF4D4D', 50: '#fff0f0', 500: '#FF4D4D', 600: '#e53e3e' },
        gold:   { DEFAULT: '#FFB830', 50: '#fffbeb', 500: '#FFB830', 600: '#d69e2e' },
        sage:   { DEFAULT: '#7DBB8A', 500: '#7DBB8A' },
        sky:    { DEFAULT: '#5BC4D1', 500: '#5BC4D1' },
        ink:    { DEFAULT: '#1A1A2E', 900: '#1A1A2E', 800: '#16213E', 700: '#0F3460' },
        cream:  { DEFAULT: '#FFF8F0', 50: '#FFF8F0' },
        blush:  { DEFAULT: '#FFE0D6' },
        purple: { DEFAULT: '#9B59B6', 500: '#9B59B6' },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        serif:   ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'marquee':     'marquee 25s linear infinite',
        'fade-up':     'fadeUp 0.6s ease forwards',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
