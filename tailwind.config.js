/** @type {import('tailwindcss').Config} */
// Tailwind config with DevHire design tokens — matches the Claude Design spec.
// Use these classes directly in your components, e.g.:
//   <div className="bg-bg text-text-primary border-border">
//   <button className="bg-accent text-white hover:bg-accent-hover">

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: '#FAF8F3',                 // page background — warm cream
        surface: '#FFFEFB',            // cards
        'surface-2': '#F7F5F0',        // hover / secondary surface

        // Text
        'text-primary': '#18181B',
        'text-secondary': '#6B6965',
        'text-tertiary': '#A09D94',

        // Borders
        border: '#E8E4DA',
        'border-strong': '#D5D0C4',

        // Accents
        accent: '#5B4FF5',             // electric violet — CTAs, focus
        'accent-hover': '#6D61FF',
        lime: '#CDEB4A',               // lime spark — use sparingly
        success: '#0F6E56',
        warning: '#BA7517',

        // Tags
        'tag-bg': '#F1EEE5',
        'tag-hover': '#E6E2D8',

        // Dark mode (later — keep the tokens handy)
        'dark-bg': '#0D0D10',
        'dark-surface': '#141417',
        'dark-text': '#F2F1ED',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '14px',
      },
    },
  },
  plugins: [],
};
