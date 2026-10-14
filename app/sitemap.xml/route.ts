import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/config'

/**
 * Master Sitemap Index (/sitemap.xml)
 *
 * Industry-standard sitemap index that cleanly organizes and delegates
 * Googlebot to specific, granular sub-sitemaps:
 *
 * 1. /sitemap/pages.xml        - Core static & landing pages
 * 2. /sitemap/categories.xml   - Category hubs (AR & EN)
 * 3. /sitemap/articles-ar.xml  - All Arabic reviews & guides
 * 4. /sitemap/articles-en.xml  - All English reviews & guides
 */
export async function GET() {
  const sitemaps = [
    `${BASE_URL}/sitemap/pages.xml`,
    `${BASE_URL}/sitemap/categories.xml`,
    `${BASE_URL}/sitemap/articles-ar.xml`,
    `${BASE_URL}/sitemap/articles-en.xml`,
  ]

  const now = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
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
