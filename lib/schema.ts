/**
 * Schema.org JSON-LD structured data builders.
 * All schemas are blog/affiliate-focused. No agency schemas.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
const SITE_NAME_AR = process.env.NEXT_PUBLIC_SITE_NAME_AR ?? ''
const SITE_NAME_EN = process.env.NEXT_PUBLIC_SITE_NAME_EN ?? ''

type Language = 'ar' | 'en'

function getSiteName(language: Language) {
  return language === 'ar' ? SITE_NAME_AR : SITE_NAME_EN
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSite — injected on homepage (includes Sitelinks Searchbox)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Organization — injected on homepage
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// BlogPosting — injected on every article page
// ─────────────────────────────────────────────────────────────────────────────

export function articleSchema(params: {
  title: string
  description: string
  slug: string
  language: Language
  publishedAt: string
  updatedAt?: string
  keywords?: string[]
  imageUrl?: string
  wordCount?: number
  author?: {
    firstName: string
    lastName: string
    slug: { current: string }
    jobTitle?: string
  }
}) {
  const { title, description, slug, language, publishedAt, updatedAt, keywords, imageUrl, wordCount, author } = params
  const url = `${BASE_URL}/${language}/${slug}`
  const siteName = getSiteName(language)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    inLanguage: language === 'ar' ? 'ar-SA' : 'en-US',
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    ...(imageUrl ? { image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 } } : {}),
    ...(wordCount ? { wordCount } : {}),
    author: author
      ? {
          '@type': 'Person',
          name: `${author.firstName} ${author.lastName}`.trim(),
          url: `${BASE_URL}/${language}/authors/${author.slug.current}`,
          ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
        }
      : { '@type': 'Organization', name: siteName, url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: BASE_URL,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Review + Product — for affiliate/review articles
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// FAQPage — auto-injected when faqBlock is in the article body
// ─────────────────────────────────────────────────────────────────────────────

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BreadcrumbList — used on all pages
// ─────────────────────────────────────────────────────────────────────────────

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Person — for the /authors/[slug] page
// ─────────────────────────────────────────────────────────────────────────────

export function personSchema(params: {
  firstName: string
  lastName: string
  slug: string
  language: Language
  jobTitle?: string
  shortBio?: string
  expertiseAreas?: string[]
  linkedin?: string
  twitter?: string
  website?: string
  avatarUrl?: string
}) {
  const name = `${params.firstName} ${params.lastName}`.trim()
  const sameAs = [params.linkedin, params.twitter, params.website].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: `${BASE_URL}/${params.language}/authors/${params.slug}`,
    ...(params.jobTitle ? { jobTitle: params.jobTitle } : {}),
    ...(params.shortBio ? { description: params.shortBio } : {}),
    ...(params.avatarUrl ? { image: { '@type': 'ImageObject', url: params.avatarUrl } } : {}),
    ...(params.expertiseAreas?.length ? { knowsAbout: params.expertiseAreas } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    worksFor: { '@type': 'Organization', name: getSiteName(params.language), url: BASE_URL },
  }
}
