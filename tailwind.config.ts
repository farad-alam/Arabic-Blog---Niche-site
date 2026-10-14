import type { Config } from 'tailwindcss'

/**
 * Brand & surface colors are driven by CSS variables in styles/globals.css.
 * To re-skin a new niche site, edit the :root block in globals.css — no
 * changes needed here. The rgb(var(--x) / <alpha-value>) pattern lets
 * Tailwind opacity modifiers (e.g. bg-brand-primary/10) keep working.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './sanity/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:  'rgb(var(--brand-primary) / <alpha-value>)',
          dark:     'rgb(var(--brand-dark) / <alpha-value>)',
          gradient: 'rgb(var(--brand-gradient) / <alpha-value>)',
          deep:     'rgb(var(--brand-deep) / <alpha-value>)',
          mid:      'rgb(var(--brand-mid) / <alpha-value>)',
          light:    'rgb(var(--brand-light) / <alpha-value>)',
        },
        // ── Light-theme surface layers ─────────────────────────────────────
        // "dark.*" token names kept so existing class names still compile;
        //  values are now the light equivalents.
        dark: {
          base:   'rgb(var(--surface-base) / <alpha-value>)',
          card:   'rgb(var(--surface-card) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
        },
        surface: {
          base:   'rgb(var(--surface-base) / <alpha-value>)',
          raised:  'rgb(var(--surface-raised) / <alpha-value>)',
          card:   'rgb(var(--surface-card) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
          hover:  'rgb(var(--surface-hover) / <alpha-value>)',
        },
        // ── Text ──────────────────────────────────────────────────────────
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          muted:   'rgb(var(--text-muted) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
          charcoal: 'rgb(var(--text-charcoal) / <alpha-value>)',
        },
        // ── Legacy light tokens (still used in a few places) ──────────────
        light: {
          bg:     'rgb(var(--surface-base) / <alpha-value>)',
          card:   'rgb(var(--surface-card) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
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
