import type { Metadata } from 'next'
import type { Locale } from './i18n'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
const SITE_NAME_AR = process.env.NEXT_PUBLIC_SITE_NAME_AR ?? ''
const SITE_NAME_EN = process.env.NEXT_PUBLIC_SITE_NAME_EN ?? ''

/** Resolve the site name for a given locale */
export function getSiteName(locale: Locale): string {
  return locale === 'ar' ? SITE_NAME_AR : SITE_NAME_EN
}

/**
 * Base metadata applied to every page.
 * Each page overrides specific fields via generateMetadata().
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
  },
}

/**
 * Generate full metadata for an article page.
 *
 * Since each article exists in ONE language only, there is no ar/en
 * conditional logic here. The article's own title/excerpt are used directly.
 * hreflang alternates are only added when a translation reference exists.
 */
export function generateArticleMetadata(post: {
  title: string
  excerpt: string
  slug: { current: string }
  language: 'ar' | 'en'
  publishedAt: string
  updatedAt?: string
  keywords?: string[]
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  noIndex?: boolean
  mainImage?: { externalUrl?: string; alt?: string }
  translation?: { slug: { current: string } } | null
  author?: { firstName: string; lastName: string; slug: { current: string } }
}): Metadata {
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const locale = post.language
  const slug = post.slug.current
  const canonical = post.canonicalUrl ?? `${BASE_URL}/${locale}/${slug}`
  const siteName = getSiteName(locale)

  // Build hreflang alternates ONLY when a translation link exists
  const alternates: Metadata['alternates'] = { canonical }
  if (post.translation) {
    const otherLocale = locale === 'ar' ? 'en' : 'ar'
    const otherSlug = post.translation.slug.current
    alternates.languages = {
      [locale]: canonical,
      [otherLocale]: `${BASE_URL}/${otherLocale}/${otherSlug}`,
      'x-default': locale === 'ar' ? canonical : `${BASE_URL}/ar/${otherSlug}`,
    }
  }

  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: post.keywords,
    authors: post.author
      ? [{ name: `${post.author.firstName} ${post.author.lastName}`.trim() }]
      : [{ name: siteName }],
    alternates,
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(post.noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}

/**
 * Generate metadata for a category page.
 */
export function generateCategoryMetadata(category: {
  titleAr: string
  titleEn: string
  slugAr: { current: string }
  slugEn: { current: string }
  descriptionAr?: string
  descriptionEn?: string
}, locale: Locale): Metadata {
  const title = locale === 'ar' ? category.titleAr : category.titleEn
  const description = locale === 'ar' ? category.descriptionAr : category.descriptionEn
  const slug = locale === 'ar' ? category.slugAr.current : category.slugEn.current
  const canonical = `${BASE_URL}/${locale}/category/${slug}`
  const siteName = getSiteName(locale)
  const otherLocale = locale === 'ar' ? 'en' : 'ar'
  const otherSlug = locale === 'ar' ? category.slugEn.current : category.slugAr.current

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical,
      languages: {
        [locale]: canonical,
        [otherLocale]: `${BASE_URL}/${otherLocale}/category/${otherSlug}`,
        'x-default': `${BASE_URL}/ar/category/${category.slugAr.current}`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
  }
}

/**
 * Generate metadata for the homepage.
 */
export function generateHomepageMetadata(locale: Locale, settings?: {
  seoTitleAr?: string
  seoTitleEn?: string
  seoDescriptionAr?: string
  seoDescriptionEn?: string
} | null): Metadata {
  const siteName = getSiteName(locale)
  const title = locale === 'ar'
    ? (settings?.seoTitleAr || siteName)
    : (settings?.seoTitleEn || siteName)
  const description = locale === 'ar'
    ? settings?.seoDescriptionAr
    : settings?.seoDescriptionEn
  const canonical = `${BASE_URL}/${locale}`
  const otherLocale = locale === 'ar' ? 'en' : 'ar'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        [locale]: canonical,
        [otherLocale]: `${BASE_URL}/${otherLocale}`,
        'x-default': `${BASE_URL}/ar`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
  }
}
