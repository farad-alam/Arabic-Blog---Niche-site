import { cache } from 'react'
import { client } from './client'
import type { Locale } from '@/lib/i18n'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SanityBlock = {
  _type: string
  _key: string
  [key: string]: unknown
}

export type SanityAuthor = {
  firstName: string
  lastName: string
  firstNameAr?: string
  lastNameAr?: string
  slug: { current: string }
  avatar?: { asset: { _ref: string }; alt: string }
  jobTitle?: string
  jobTitleAr?: string
  shortBio?: string
  shortBioAr?: string
  fullBio?: SanityBlock[]
  expertiseAreas?: string[]
  yearsExperience?: number
  linkedin?: string
  twitter?: string
  website?: string
}

export type SanityCategory = {
  _id: string
  titleAr: string
  titleEn: string
  slugAr: { current: string }
  slugEn: { current: string }
  descriptionAr?: string
  descriptionEn?: string
  parent?: { titleAr: string; titleEn: string; slugAr: { current: string }; slugEn: { current: string } }
  icon?: string
  order?: number
  postCount?: number
}

export type SanityPost = {
  _id: string
  language: 'ar' | 'en'
  title: string
  slug: { current: string }
  excerpt: string
  mainImage?: {
    asset?: { _ref?: string; secure_url?: string; url?: string }
    externalUrl?: string
    alt: string
  }
  category?: SanityCategory
  author?: SanityAuthor
  publishedAt: string
  updatedAt?: string
  articleType?: string
  keywords?: string[]
  body?: SanityBlock[]
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  noIndex?: boolean
  affiliateDisclosure?: boolean
  overallRating?: number
  translation?: { slug: { current: string }; language: 'ar' | 'en' } | null
  related?: SanityPostCard[]
  readTime?: string
  wordCount?: number
}

export type SanityPostCard = {
  _id: string
  language: 'ar' | 'en'
  title: string
  slug: { current: string }
  excerpt: string
  mainImage?: { asset?: { _ref?: string; secure_url?: string; url?: string }; externalUrl?: string; alt: string }
  category?: { titleAr: string; titleEn: string; slugAr: { current: string }; slugEn: { current: string } }
  author?: Pick<SanityAuthor, 'firstName' | 'lastName' | 'firstNameAr' | 'lastNameAr' | 'slug' | 'avatar'>
  publishedAt: string
  readTime?: string
}


// ─────────────────────────────────────────────────────────────────────────────
// Reusable GROQ fragments
// ─────────────────────────────────────────────────────────────────────────────

const AUTHOR_FRAGMENT = `
  "author": author->{
    firstName,
    lastName,
    firstNameAr,
    lastNameAr,
    slug,
    avatar { asset, alt },
    jobTitle,
    jobTitleAr,
    shortBio,
    shortBioAr,
    expertiseAreas,
    yearsExperience,
    linkedin,
    twitter,
    website
  }
`

const CATEGORY_FRAGMENT = `
  "category": category->{
    _id,
    titleAr,
    titleEn,
    slugAr,
    slugEn,
    descriptionAr,
    descriptionEn,
    icon,
    "parent": parent->{ titleAr, titleEn, slugAr, slugEn }
  }
`

const POST_CARD_FRAGMENT = `
  _id,
  language,
  title,
  slug,
  excerpt,
  mainImage { asset, externalUrl, alt },
  "category": category->{ titleAr, titleEn, slugAr, slugEn },
  "author": author->{ firstName, lastName, firstNameAr, lastNameAr, slug, avatar { asset, alt } },
  publishedAt,
  "readTime": round(length(pt::text(body)) / 1500) + " min"
`


// ─────────────────────────────────────────────────────────────────────────────
// Posts — filtered by language
// ─────────────────────────────────────────────────────────────────────────────

/** Get all posts for a given locale (listing page) */
export async function getPostsByLocale(locale: Locale, limit = 50): Promise<SanityPostCard[]> {
  return client.fetch(
    `*[_type == "post" && language == $locale && noIndex != true] | order(publishedAt desc) [0...$limit] {
      ${POST_CARD_FRAGMENT}
    }`,
    { locale, limit },
    { next: { tags: ['posts'] } }
  )
}

/** Get paginated posts for a locale */
export async function getPaginatedPosts(
  locale: Locale,
  page: number,
  perPage = 12
): Promise<{ posts: SanityPostCard[]; total: number }> {
  const start = (page - 1) * perPage
  const end = start + perPage
  const [posts, total] = await Promise.all([
    client.fetch<SanityPostCard[]>(
      `*[_type == "post" && language == $locale && noIndex != true] | order(publishedAt desc) [$start...$end] {
        ${POST_CARD_FRAGMENT}
      }`,
      { locale, start, end },
      { next: { tags: ['posts'] } }
    ),
    client.fetch<number>(
      `count(*[_type == "post" && language == $locale && noIndex != true])`,
      { locale },
      { next: { tags: ['posts'] } }
    ),
  ])
  return { posts, total }
}

/** Get all post slugs for a locale — used in generateStaticParams */
export async function getAllPostSlugs(locale: Locale): Promise<string[]> {
  const results = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "post" && language == $locale && noIndex != true]{ slug }`,
    { locale },
    { next: { tags: ['posts'] } }
  )
  return results.map((r) => r.slug.current)
}

/** Get all posts of both locales for the sitemap */
export async function getAllPostsForSitemap(): Promise<
  {
    slug: string
    language: 'ar' | 'en'
    updatedAt?: string
    publishedAt: string
    translationSlug?: string
  }[]
> {
  return client.fetch(
    `*[_type == "post" && noIndex != true] {
      "slug": slug.current,
      language,
      publishedAt,
      updatedAt,
      "translationSlug": translation->slug.current
    }`,
    {},
    { next: { tags: ['posts'] } }
  )
}

/** Get a single post by slug — wrapped with React cache to dedupe calls */
export const getPost = cache(async (slug: string, locale: Locale): Promise<SanityPost | null> => {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug && language == $locale][0] {
      _id,
      language,
      title,
      slug,
      excerpt,
      mainImage { asset, externalUrl, alt },
      ${CATEGORY_FRAGMENT},
      ${AUTHOR_FRAGMENT},
      publishedAt,
      updatedAt,
      articleType,
      keywords,
      body,
      seoTitle,
      seoDescription,
      canonicalUrl,
      noIndex,
      affiliateDisclosure,
      overallRating,
      "translation": translation->{ slug, language },
      "readTime": round(length(pt::text(body)) / 1500) + " min",
      "wordCount": length(string::split(pt::text(body), " ")),
      "related": *[_type == "post" && language == $locale && category._ref == ^.category._ref && slug.current != $slug && noIndex != true][0...3] {
        ${POST_CARD_FRAGMENT}
      }
    }`,
    { slug, locale },
    { next: { tags: ['posts'] } }
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

/** Get all top-level categories */
export async function getTopLevelCategories(): Promise<SanityCategory[]> {
  return client.fetch(
    `*[_type == "category" && !defined(parent)] | order(order asc) {
      _id,
      titleAr,
      titleEn,
      slugAr,
      slugEn,
      descriptionAr,
      descriptionEn,
      icon,
      order
    }`,
    {},
    { next: { tags: ['categories'] } }
  )
}

/** Get all categories including subcategories */
export async function getAllCategories(): Promise<SanityCategory[]> {
  return client.fetch(
    `*[_type == "category"] | order(order asc) {
      _id,
      titleAr,
      titleEn,
      slugAr,
      slugEn,
      descriptionAr,
      descriptionEn,
      icon,
      order,
      "parent": parent->{ titleAr, titleEn, slugAr, slugEn }
    }`,
    {},
    { next: { tags: ['categories'] } }
  )
}

/** Get a single category by slug (locale-aware) */
export const getCategoryBySlug = cache(
  async (slug: string, locale: Locale): Promise<SanityCategory | null> => {
    const field = locale === 'ar' ? 'slugAr.current' : 'slugEn.current'
    return client.fetch(
      `*[_type == "category" && ${field} == $slug][0] {
        _id,
        titleAr,
        titleEn,
        slugAr,
        slugEn,
        descriptionAr,
        descriptionEn,
        icon,
        "parent": parent->{ titleAr, titleEn, slugAr, slugEn }
      }`,
      { slug },
      { next: { tags: ['categories'] } }
    )
  }
)

/** Get posts for a specific category, filtered by locale */
export async function getPostsByCategory(
  categoryId: string,
  locale: Locale,
  limit = 20
): Promise<SanityPostCard[]> {
  return client.fetch(
    `*[_type == "post" && language == $locale && category._ref == $categoryId && noIndex != true]
      | order(publishedAt desc) [0...$limit] {
      ${POST_CARD_FRAGMENT}
    }`,
    { locale, categoryId, limit },
    { next: { tags: [`category-${categoryId}`] } }
  )
}

/** Get all category slugs — for generateStaticParams */
export async function getAllCategorySlugs(): Promise<
  { slugAr: string; slugEn: string }[]
> {
  const results = await client.fetch<
    { slugAr: { current: string }; slugEn: { current: string } }[]
  >(
    `*[_type == "category"]{ slugAr, slugEn }`,
    {},
    { next: { tags: ['categories'] } }
  )
  return results.map((r) => ({ slugAr: r.slugAr.current, slugEn: r.slugEn.current }))
}

/** Top-level categories with the number of published posts in a locale */
export async function getCategoriesWithCounts(locale: Locale): Promise<SanityCategory[]> {
  return client.fetch(
    `*[_type == "category" && !defined(parent)] | order(order asc) {
      _id,
      titleAr,
      titleEn,
      slugAr,
      slugEn,
      descriptionAr,
      descriptionEn,
      icon,
      order,
      "postCount": count(*[_type == "post" && language == $locale && noIndex != true && category._ref == ^._id])
    }`,
    { locale },
    { next: { tags: ['categories', 'posts'] } }
  )
}

/** Lightweight record used by the client-side search page */
export type SearchIndexEntry = {
  title: string
  slug: string
  language: 'ar' | 'en'
  excerpt?: string
  publishedAt: string
  categoryTitle?: string
  mainImage?: SanityPostCard['mainImage']
}

/** Every indexable post (both locales) — baked into /search-index.json at build time */
export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  return client.fetch(
    `*[_type == "post" && noIndex != true] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      language,
      excerpt,
      publishedAt,
      "categoryTitle": select(language == "ar" => category->titleAr, category->titleEn),
      mainImage { asset, externalUrl, alt }
    }`,
    {},
    { next: { tags: ['posts'] } }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Authors
// ─────────────────────────────────────────────────────────────────────────────

export type SanityAuthorWithPosts = SanityAuthor & {
  _id: string
  fullBio?: SanityBlock[]
  posts: SanityPostCard[]
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const results = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "author"]{ slug }`,
    {},
    { next: { tags: ['authors'] } }
  )
  return results.map((r) => r.slug.current)
}

export const getAuthor = cache(
  async (slug: string, locale: Locale): Promise<SanityAuthorWithPosts | null> => {
    return client.fetch(
      `*[_type == "author" && slug.current == $slug][0] {
        _id,
        firstName,
        lastName,
        firstNameAr,
        lastNameAr,
        slug,
        avatar { asset, alt },
        jobTitle,
        jobTitleAr,
        shortBio,
        shortBioAr,
        fullBio,
        expertiseAreas,
        yearsExperience,
        linkedin,
        twitter,
        website,
        "posts": *[_type == "post" && language == $locale && references(^._id) && noIndex != true]
          | order(publishedAt desc) {
          ${POST_CARD_FRAGMENT}
        }
      }`,
      { slug, locale },
      { next: { tags: ['authors'] } }
    )
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────────────────────────────────────────

export type SanitySiteSettings = {
  // Identity
  siteNameAr?: string
  siteNameEn?: string
  // SEO
  seoTitleAr?: string
  seoDescriptionAr?: string
  seoTitleEn?: string
  seoDescriptionEn?: string
  seoImage?: { asset?: { _ref: string }; alt?: string }
  // Analytics — all optional, script only renders if value is present
  gaId?: string
  gscVerification?: string
  bingVerification?: string
  clarityId?: string
  hotjarId?: string
  // Social
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  pinterest?: string
  // Homepage hero
  heroBadgeAr?: string
  heroBadgeEn?: string
  heroHeadingAr?: string
  heroHeadingEn?: string
  heroHighlightAr?: string
  heroHighlightEn?: string
  heroSubheadingAr?: string
  heroSubheadingEn?: string
  // Footer
  footerAboutAr?: string
  footerAboutEn?: string
  copyrightAr?: string
  copyrightEn?: string
  // Contact
  contactEmail?: string
  contactPhone?: string
  whatsapp?: string
  addressAr?: string
  addressEn?: string
}

/**
 * getSiteSettings — fetches the singleton siteSettings document.
 *
 * Performance notes:
 * - Wrapped in React cache(): within a single server render tree,
 *   this is called at most once regardless of how many components need it.
 * - ISR tag 'siteSettings': cached between requests. Only re-fetches
 *   when the Sanity webhook fires revalidateTag('siteSettings').
 * - Workflow: Save in Sanity → webhook → cache busted → next visitor
 *   gets fresh data. Zero redeploys needed.
 */
export const getSiteSettings = cache(
  async (): Promise<SanitySiteSettings | null> => {
    return client.fetch(
      `*[_type == "siteSettings"][0] {
        siteNameAr,
        siteNameEn,
        seoTitleAr,
        seoDescriptionAr,
        seoTitleEn,
        seoDescriptionEn,
        seoImage { asset, alt },
        gaId,
        gscVerification,
        bingVerification,
        clarityId,
        hotjarId,
        twitter,
        facebook,
        instagram,
        youtube,
        tiktok,
        pinterest,
        heroBadgeAr,
        heroBadgeEn,
        heroHeadingAr,
        heroHeadingEn,
        heroHighlightAr,
        heroHighlightEn,
        heroSubheadingAr,
        heroSubheadingEn,
        footerAboutAr,
        footerAboutEn,
        copyrightAr,
        copyrightEn,
        contactEmail,
        contactPhone,
        whatsapp,
        addressAr,
        addressEn
      }`,
      {},
      { next: { tags: ['siteSettings'] } }
    )
  }
)
