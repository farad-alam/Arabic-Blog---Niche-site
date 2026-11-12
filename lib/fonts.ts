import { Cairo, Tajawal, Outfit } from 'next/font/google'

/**
 * ══ FONTS — the ONE file to edit to change a site's typography ══
 *
 * Swap the font imports/calls below (any Google font works), keep the three
 * exported names and their `variable` CSS names — Tailwind (tailwind.config.ts)
 * and globals.css already read --font-arabic-heading, --font-arabic-body and
 * --font-latin, so nothing else needs to change.
 *
 * next/font requires the font function calls to be plain top-level constants
 * with literal options, so they live here and are re-used by the layout.
 */

/** Arabic headings (H1–H6 on /ar pages) */
export const fontArabicHeading = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic-heading',
  weight: ['600', '700', '800'],
  display: 'swap',
})

/** Arabic body text */
export const fontArabicBody = Tajawal({
  subsets: ['arabic'],
  variable: '--font-arabic-body',
  weight: ['400', '500', '700'],
  display: 'swap',
})

/** English / Latin text (headings + body on /en pages) */
export const fontLatin = Outfit({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
})
