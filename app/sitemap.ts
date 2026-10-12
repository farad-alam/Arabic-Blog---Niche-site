import type { MetadataRoute } from 'next'
import { getAllPostsForSitemap, getAllCategorySlugs } from '@/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.carcleanksa.com'

/**
 * Enterprise Multilingual Sitemap Architecture
 *
 * Next.js automatically generates the master sitemap index at `/sitemap.xml`
 * linking to each sub-sitemap declared in `generateSitemaps()`:
 *
 * 1. /sitemap/pages.xml        - Core static utility & landing pages (Home, About, Privacy, etc.)
 * 2. /sitemap/categories.xml   - Category hub pages (AR & EN)
 * 3. /sitemap/articles-ar.xml  - Arabic articles with lastmod & bidirectional hreflang alternates
 * 4. /sitemap/articles-en.xml  - English articles with lastmod & bidirectional hreflang alternates
 */
export async function generateSitemaps() {
  return [
    { id: 'pages' },
    { id: 'categories' },
    { id: 'articles-ar' },
    { id: 'articles-en' },
  ]
}

export default async function sitemap(
  props?: { id?: string } | Promise<{ id?: string }>
): Promise<MetadataRoute.Sitemap> {
  const resolved = props ? await Promise.resolve(props) : undefined
  const id = resolved?.id

  // ── 1. Pages Sub-Sitemap ────────────────────────────────────────────────────
  if (id === 'pages') {
    return [
      { url: `${BASE_URL}/ar`, changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/en`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/ar/articles`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${BASE_URL}/en/articles`, changeFrequency: 'daily', priority: 0.7 },
      { url: `${BASE_URL}/ar/about`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${BASE_URL}/en/about`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${BASE_URL}/ar/contact`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${BASE_URL}/en/contact`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${BASE_URL}/ar/privacy`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${BASE_URL}/en/privacy`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${BASE_URL}/ar/terms`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${BASE_URL}/en/terms`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${BASE_URL}/ar/disclosure`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${BASE_URL}/en/disclosure`, changeFrequency: 'yearly', priority: 0.2 },
    ]
  }

  // ── 2. Categories Sub-Sitemap ───────────────────────────────────────────────
  if (id === 'categories') {
    const categories = await getAllCategorySlugs()
    return categories.flatMap((cat) => [
      {
        url: `${BASE_URL}/ar/category/${cat.slugAr}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/en/category/${cat.slugEn}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
    ])
  }

  // ── 3. Arabic Articles Sub-Sitemap ──────────────────────────────────────────
  if (id === 'articles-ar') {
    const posts = await getAllPostsForSitemap()
    const arPosts = posts.filter((p) => p.language === 'ar')

    return arPosts.map((post) => {
      const url = `${BASE_URL}/ar/${post.slug}`
      const entry: MetadataRoute.Sitemap[number] = {
        url,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }

      if (post.translationSlug) {
        entry.alternates = {
          languages: {
            ar: url,
            en: `${BASE_URL}/en/${post.translationSlug}`,
          },
        }
      }

      return entry
    })
  }

  // ── 4. English Articles Sub-Sitemap ─────────────────────────────────────────
  if (id === 'articles-en') {
    const posts = await getAllPostsForSitemap()
    const enPosts = posts.filter((p) => p.language === 'en')

    return enPosts.map((post) => {
      const url = `${BASE_URL}/en/${post.slug}`
      const entry: MetadataRoute.Sitemap[number] = {
        url,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }

      if (post.translationSlug) {
        entry.alternates = {
          languages: {
            en: url,
            ar: `${BASE_URL}/ar/${post.translationSlug}`,
          },
        }
      }

      return entry
    })
  }

  // ── Fallback: If accessed without id or unknown id, return all combined ───
  const [posts, categories] = await Promise.all([
    getAllPostsForSitemap(),
    getAllCategorySlugs(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ar`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/en`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/ar/articles`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/en/articles`, changeFrequency: 'daily', priority: 0.7 },
  ]

  const articlePages: MetadataRoute.Sitemap = posts.map((post) => {
    const url = `${BASE_URL}/${post.language}/${post.slug}`
    const entry: MetadataRoute.Sitemap[number] = {
      url,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
    if (post.translationSlug) {
      const otherLang = post.language === 'ar' ? 'en' : 'ar'
      entry.alternates = {
        languages: {
          [post.language]: url,
          [otherLang]: `${BASE_URL}/${otherLang}/${post.translationSlug}`,
        },
      }
    }
    return entry
  })

  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => [
    { url: `${BASE_URL}/ar/category/${cat.slugAr}`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/en/category/${cat.slugEn}`, changeFrequency: 'weekly' as const, priority: 0.6 },
  ])

  return [...staticPages, ...articlePages, ...categoryPages]
}
