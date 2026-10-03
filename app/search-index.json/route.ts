import { getSearchIndex } from '@/sanity/queries'
import { getImageUrl } from '@/sanity/image'

// Prerendered at build time → served as a plain static file (no server runtime needed).
export const dynamic = 'force-static'

/** Compact search index consumed by the client-side search page. */
export async function GET() {
  const entries = await getSearchIndex()

  const payload = entries.map((e) => ({
    title: e.title,
    slug: e.slug,
    language: e.language,
    excerpt: e.excerpt ?? '',
    publishedAt: e.publishedAt,
    categoryTitle: e.categoryTitle ?? '',
    image: getImageUrl(e.mainImage, { width: 600, height: 338 }) ?? null,
    imageAlt: e.mainImage?.alt ?? e.title,
  }))

  return Response.json(payload)
}
