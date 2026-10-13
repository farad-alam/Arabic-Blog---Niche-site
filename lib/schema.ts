export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

type Language = 'ar' | 'en'

// ─────────────────────────────────────────────────────────────────────────────
// WebSite — injected on homepage
// ─────────────────────────────────────────────────────────────────────────────

export function websiteSchema(params: {
  /** Site name for the current locale — pass from getSiteSettings() */
  name: string
  language: Language
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: params.name,
    url: params.url ?? BASE_URL,
    inLanguage: params.language === 'ar' ? 'ar' : 'en',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Organization — injected on homepage
// ─────────────────────────────────────────────────────────────────────────────

export function organizationSchema(params: {
  /** Site name for the current locale — pass from getSiteSettings() */
  name: string
  url?: string
  logoUrl?: string
  /** Only include real, working profile URLs */
  sameAs?: string[]
}) {
  const sameAs = (params.sameAs ?? []).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: params.name,
    url: params.url ?? BASE_URL,
    ...(params.logoUrl ? { logo: { '@type': 'ImageObject', url: params.logoUrl } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

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
  /** Site name for the publisher field — pass from getSiteSettings() */
  siteName?: string
  logoUrl?: string
  author?: {
    firstName: string
    lastName: string
    slug: { current: string }
    jobTitle?: string
  }
}) {
  const { title, description, slug, language, publishedAt, updatedAt, keywords, imageUrl, wordCount, siteName, logoUrl, author } = params
  const url = `${BASE_URL}/${language}/${slug}`

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
      : { '@type': 'Organization', name: siteName ?? '', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: siteName ?? '',
      url: BASE_URL,
      ...(logoUrl ? { logo: { '@type': 'ImageObject', url: logoUrl } } : {}),
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
  /** Site name — pass from getSiteSettings() */
  siteName?: string
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
    worksFor: { '@type': 'Organization', name: params.siteName ?? '', url: BASE_URL },
  }
}
