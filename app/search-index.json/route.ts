import { getSearchIndex } from '@/sanity/queries'
import { getImageUrl } from '@/sanity/image'

// ISR: revalidated whenever the webhook fires revalidateTag('posts')
export const revalidate = false

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
