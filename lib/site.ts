import type { Locale } from '@/lib/i18n'
import type { SanitySiteSettings } from '@/sanity/queries'

/**
 * Default site copy (micro-niche: air fryers & small kitchen appliances).
 * Every value here can be overridden from Sanity → Site Settings.
 * Change these defaults when the site broadens to the full Home & Kitchen niche.
 */
const DEFAULTS = {
  ar: {
    siteName: 'دليل المطبخ الذكي',
    heroBadge: 'مراجعات حقيقية بعد التجربة',
    heroHeading: 'اختر أفضل ',
    heroHighlight: 'قلاية هوائية لمطبخك',
    heroSubheading:
      'نقارن لك القلايات الهوائية وأجهزة المطبخ الصغيرة بعد تجربة فعلية، لتشتري الجهاز المناسب لعائلتك وميزانيتك دون حيرة.',
    footerAbout:
      'دليلك العربي لاختيار القلايات الهوائية وأجهزة المطبخ الذكية: مراجعات صادقة، مقارنات واضحة، ونصائح طبخ عملية.',
    copyright: 'جميع الحقوق محفوظة.',
  },
  en: {
    siteName: 'Smart Kitchen Guide',
    heroBadge: 'Honest, hands-on reviews',
    heroHeading: 'Find the best ',
    heroHighlight: 'air fryer for your kitchen',
    heroSubheading:
      'We compare air fryers and small kitchen appliances so you can pick the right one for your family and budget, with no guesswork.',
    footerAbout:
      'Your guide to choosing air fryers and smart kitchen appliances: honest reviews, clear comparisons and practical cooking tips.',
    copyright: 'All rights reserved.',
  },
} as const

/** Pick the Arabic/English variant of a settings field, falling back to the default. */
function pick(
  settings: SanitySiteSettings | null,
  locale: Locale,
  field: string,
  fallback: string,
): string {
  const key = `${field}${locale === 'ar' ? 'Ar' : 'En'}` as keyof SanitySiteSettings
  const value = settings?.[key]
  return typeof value === 'string' && value.trim() ? value : fallback
}

export function getSiteName(settings: SanitySiteSettings | null, locale: Locale): string {
  return pick(settings, locale, 'siteName', DEFAULTS[locale].siteName)
}

export function getHeroCopy(settings: SanitySiteSettings | null, locale: Locale) {
  const d = DEFAULTS[locale]
  let heading = pick(settings, locale, 'heroHeading', d.heroHeading)
  const highlight = pick(settings, locale, 'heroHighlight', d.heroHighlight)

  // Guard against CMS content where the heading already contains the
  // highlight text — otherwise Hero would render the phrase twice.
  if (highlight && heading.endsWith(highlight)) {
    // Highlight is a suffix (intended pattern): keep it, strip it from heading
    heading = heading.slice(0, -highlight.length).trimEnd()
  } else if (highlight && heading.includes(highlight)) {
    // Highlight buried mid-sentence: keep the full heading, skip the gradient span
    return {
      badge: pick(settings, locale, 'heroBadge', d.heroBadge),
      heading,
      highlight: '',
      subheading: pick(settings, locale, 'heroSubheading', d.heroSubheading),
    }
  }

  return {
    badge: pick(settings, locale, 'heroBadge', d.heroBadge),
    heading,
    highlight,
    subheading: pick(settings, locale, 'heroSubheading', d.heroSubheading),
  }
}

export function getFooterCopy(settings: SanitySiteSettings | null, locale: Locale) {
  const d = DEFAULTS[locale]
  return {
    about: pick(settings, locale, 'footerAbout', d.footerAbout),
    copyright: pick(settings, locale, 'copyright', d.copyright),
    address: pick(settings, locale, 'address', ''),
  }
}

/**
 * Sanitized X/Twitter handle (with leading @), or undefined when the CMS
 * value is empty / not a real handle (e.g. just "@"), so callers can skip
 * rendering the footer icon and the twitter:creator meta tag.
 */
export function getTwitterHandle(settings: SanitySiteSettings | null): string | undefined {
  const raw = settings?.twitter?.trim() ?? ''
  const handle = raw.replace(/^@/, '')
  return handle ? `@${handle}` : undefined
}

/**
 * Sanitize a social profile URL from the CMS for rendering as a footer link.
 * Returns an https URL with a real profile path, or undefined when the value
 * is empty / not a usable profile link (bare domain, http-only, etc.).
 */
export function getSocialUrl(raw: string | undefined | null): string | undefined {
  const value = raw?.trim()
  if (!value) return undefined
  let url: URL
  try {
    url = new URL(value.replace(/^http:\/\//, 'https://'))
  } catch {
    return undefined
  }
  if (url.protocol !== 'https:') return undefined
  // Require a path beyond the bare domain — "https://twitter.com/" is not a profile
  const path = url.pathname.replace(/\/+$/, '')
  if (!path) return undefined
  return `${url.origin}${path}`
}
