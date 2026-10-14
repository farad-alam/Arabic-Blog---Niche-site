import type { Locale } from '@/lib/i18n'
import type { SanitySiteSettings } from '@/sanity/queries'

/**
 * Neutral default site copy — only shown when Site Settings in Sanity are blank.
 * Keep these generic: a new niche site fills real values in Sanity → Site Settings,
 * never by editing this file.
 */
const DEFAULTS = {
  ar: {
    siteName: 'مدونة عربية',
    heroBadge: 'مراجعات ومحتوى موثوق',
    heroHeading: 'اكتشف ',
    heroHighlight: 'أفضل المحتويات',
    heroSubheading:
      'مراجعات صادقة ومقارنات واضحة تساعدك على اختيار الأنسب لك، دون حيرة.',
    footerAbout:
      'موقع عربي يقدم مراجعات صادقة ومقارنات واضحة ونصائح عملية.',
    copyright: 'جميع الحقوق محفوظة.',
  },
  en: {
    siteName: 'Blog',
    heroBadge: 'Trusted reviews & guides',
    heroHeading: 'Find ',
    heroHighlight: 'the best content',
    heroSubheading:
      'Honest reviews and clear comparisons that help you pick what fits you best, with no guesswork.',
    footerAbout:
      'A site with honest reviews, clear comparisons and practical tips.',
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
