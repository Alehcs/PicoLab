/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Button and Badge build their variant/size class names dynamically
  // (`p-btn-${variant}`, `p-badge-${variant}`), so the literal names never
  // appear in source for the content scanner. These component classes live in
  // `@layer components`, which Tailwind tree-shakes — without safelisting them
  // the variant styles get purged and buttons/badges render unstyled.
  safelist: [{ pattern: /^p-btn(-.+)?$/ }, { pattern: /^p-badge(-.+)?$/ }],
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
