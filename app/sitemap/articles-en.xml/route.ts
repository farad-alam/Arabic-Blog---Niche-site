import { NextResponse } from 'next/server'
import { getAllPostsForSitemap } from '@/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.carcleanksa.com'

export async function GET() {
  const posts = await getAllPostsForSitemap()
  const enPosts = posts.filter((p) => p.language === 'en')

  const xmlEntries = enPosts.map((post) => {
    const loc = `${BASE_URL}/en/${post.slug}`
    const lastmod = (post.updatedAt || post.publishedAt || new Date().toISOString()).split('T')[0]

    let alternateTag = ''
    if (post.translationSlug) {
      alternateTag = `\n    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/${post.translationSlug}"/>`
    }

    return `  <url>
    <loc>${loc}</loc>${alternateTag}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate',
    },
  })
}
