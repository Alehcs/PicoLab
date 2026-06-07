/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pico: {
          bg: 'var(--pico-bg)',
          surface: 'var(--pico-surface)',
          soft: 'var(--pico-soft)',
          border: 'var(--pico-border)',
          text: 'var(--pico-text)',
          secondary: 'var(--pico-secondary)',
          muted: 'var(--pico-muted)',
          blue: 'var(--pico-blue)',
          green: 'var(--pico-green)',
          coral: 'var(--pico-coral)',
          yellow: 'var(--pico-yellow)',
          tail: 'var(--pico-tail-red)',
          softBlue: 'var(--pico-soft-blue)',
          softGreen: 'var(--pico-soft-green)',
          softYellow: 'var(--pico-soft-yellow)',
          softCoral: 'var(--pico-soft-coral)',
        },
      },
      fontFamily: {
        sans: ['var(--pico-font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--pico-font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        pico: '18px',
      },
      boxShadow: {
        picoButton: '0 4px 14px rgba(74, 144, 226, 0.30)',
      },
    },
  },
  plugins: [],
};
