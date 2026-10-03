import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:  '#006C35',
          dark:     '#005027',
          gradient: '#00994C',
          deep:     '#003B1C',
          mid:      '#007F3F',
          light:    '#006C35',   // on light bg, lighter purple looks washed — keep primary
          glow:     'rgba(0,108,53,0.15)',
        },
        // ── Light-theme surface layers ─────────────────────────────────────
        // "dark.*" token names kept so existing class names still compile;
        //  values are now the light equivalents.
        dark: {
          base:   '#FAF8F5',    // warm cream page background
          card:   '#FFFFFF',    // card surface (pops slightly above cream)
          border: '#E8E2D9',    // warm border (not cold grey)
        },
        surface: {
          base:   '#FAF8F5',
          raised:  '#F4F0EA',   // slightly darker for strip / sidebar backgrounds
          card:   '#FFFFFF',
          border: '#E8E2D9',
          hover:  '#F0EBE3',    // subtle hover state
        },
        // ── Text ──────────────────────────────────────────────────────────
        text: {
          primary: '#1C1917',   // near-black (warm stone-900)
          muted:   '#6B6560',   // warm medium grey
          inverse: '#FFFFFF',
          charcoal: '#333333',
        },
        // ── Legacy light tokens (still used in a few places) ──────────────
        light: {
          bg:     '#FAF8F5',
          card:   '#FFFFFF',
          border: '#E8E2D9',
        },
        state: {
          error:   '#DC2626',
          success: '#16A34A',
          warning: '#D97706',
        },
      },
      borderRadius: {
        sm:   '3px',
        md:   '8px',
        lg:   '16px',
        xl:   '24px',
        full: '9999px',
      },
      fontFamily: {
        // Arabic
        'arabic-heading': ['var(--font-arabic-heading)', 'Cairo', 'sans-serif'],
        'arabic-body':    ['var(--font-arabic-body)', 'Tajawal', 'sans-serif'],
        // English / Latin
        heading: ['var(--font-latin)', 'Outfit', 'sans-serif'],
        body:    ['var(--font-latin)', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'sm-light':  '0 1px 4px rgba(28,25,23,0.06)',
        'md-light':  '0 4px 16px -2px rgba(28,25,23,0.08)',
        'lg-light':  '0 8px 30px -4px rgba(28,25,23,0.10)',
        'card':      '0 2px 8px rgba(28,25,23,0.06)',
        'card-hover':'0 6px 24px rgba(28,25,23,0.10)',
        'btn-inset': 'rgba(255,255,255,0.72) 0px 2px 3px 0px inset',
        // kept for Navbar scroll state
        'sm-dark':   '0 1px 4px rgba(15,23,42,0.06)',
        'md-dark':   '0 4px 16px -2px rgba(15,23,42,0.08)',
      },
      minHeight: { touch: '44px' },
      minWidth:  { touch: '44px' },
    },
  },
  plugins: [],
}

export default config
