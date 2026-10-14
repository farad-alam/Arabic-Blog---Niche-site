import { NextResponse } from 'next/server'
import { getAllCategorySlugs } from '@/sanity/queries'
import { BASE_URL } from '@/lib/config'

export async function GET() {
  const categories = await getAllCategorySlugs()

  const entries: { url: string; changefreq: string; priority: string }[] = []

  for (const cat of categories) {
    if (cat.slugAr) {
      entries.push({
        url: `${BASE_URL}/ar/category/${cat.slugAr}`,
        changefreq: 'monthly',
        priority: '0.7',
      })
    }
    if (cat.slugEn) {
      entries.push({
        url: `${BASE_URL}/en/category/${cat.slugEn}`,
        changefreq: 'monthly',
        priority: '0.6',
      })
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate',
    },
  })
}
