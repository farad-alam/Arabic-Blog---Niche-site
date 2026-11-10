import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/config'
import { getAllPostsForSitemap } from '@/sanity/queries'

/**
 * Master Sitemap Index (/sitemap.xml)
 *
 * Industry-standard sitemap index that cleanly organizes and delegates
 * Googlebot to specific, granular sub-sitemaps (category pages are noindex, so they are not listed):
 *
 * 1. /sitemap/pages.xml        - Core static & landing pages
 * 2. /sitemap/articles-ar.xml  - All Arabic reviews & guides
 * 3. /sitemap/articles-en.xml  - All English reviews & guides
 */
export async function GET() {
  const posts = await getAllPostsForSitemap()
  const newest = (lang?: 'ar' | 'en') =>
    posts
      .filter((p) => !lang || p.language === lang)
      .map((p) => p.updatedAt || p.publishedAt)
      .filter(Boolean)
      .sort()
      .pop()

  // lastmod = when the content listed in that sitemap last really changed.
  // (Search engines ignore lastmod once it is shown to be unreliable, so never use "now".)
  const sitemaps: { loc: string; lastmod?: string }[] = [
    { loc: `${BASE_URL}/sitemap/pages.xml`, lastmod: newest() },
    { loc: `${BASE_URL}/sitemap/articles-ar.xml`, lastmod: newest('ar') },
    { loc: `${BASE_URL}/sitemap/articles-en.xml`, lastmod: newest('en') },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>${s.lastmod ? `\n    <lastmod>${s.lastmod}</lastmod>` : ''}
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate',
    },
  })
}
