import type { MetadataRoute } from 'next'
import { getAllPostsForSitemap, getAllCategorySlugs } from '@/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

/**
 * Sitemap — language-aware
 *
 * Articles: Each article has its own URL (/{locale}/{slug}).
 * hreflang alternates only added when translation link exists.
 * Categories: Both AR and EN URLs for each category.
 * Static pages: Homepage, about, privacy, terms for both locales.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    getAllPostsForSitemap(),
    getAllCategorySlugs(),
  ])

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ar`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/en`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/ar/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/en/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/ar/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/en/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/ar/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/en/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // ── Article pages ──────────────────────────────────────────────────────────
  const articlePages: MetadataRoute.Sitemap = posts.map((post) => {
    const url = `${BASE_URL}/${post.language}/${post.slug}`
    const entry: MetadataRoute.Sitemap[number] = {
      url,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }

    // Add hreflang alternates only when a translation link exists
    if (post.translationSlug) {
      const otherLang = post.language === 'ar' ? 'en' : 'ar'
      ;(entry as any).alternates = {
        languages: {
          [post.language]: url,
          [otherLang]: `${BASE_URL}/${otherLang}/${post.translationSlug}`,
        },
      }
    }

    return entry
  })

  // ── Category pages ─────────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => [
    {
      url: `${BASE_URL}/ar/category/${cat.slugAr}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/en/category/${cat.slugEn}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ])

  return [...staticPages, ...articlePages, ...categoryPages]
}
