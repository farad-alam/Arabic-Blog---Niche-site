import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.carcleanksa.com'

export async function GET() {
  const pages = [
    { url: `${BASE_URL}/ar`, changefreq: 'daily', priority: '1.0' },
    { url: `${BASE_URL}/en`, changefreq: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/ar/articles`, changefreq: 'daily', priority: '0.8' },
    { url: `${BASE_URL}/en/articles`, changefreq: 'daily', priority: '0.7' },
    { url: `${BASE_URL}/ar/about`, changefreq: 'monthly', priority: '0.4' },
    { url: `${BASE_URL}/en/about`, changefreq: 'monthly', priority: '0.4' },
    { url: `${BASE_URL}/ar/contact`, changefreq: 'monthly', priority: '0.4' },
    { url: `${BASE_URL}/en/contact`, changefreq: 'monthly', priority: '0.4' },
    { url: `${BASE_URL}/ar/privacy`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/en/privacy`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/ar/terms`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/en/terms`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/ar/disclosure`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/en/disclosure`, changefreq: 'yearly', priority: '0.2' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
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
