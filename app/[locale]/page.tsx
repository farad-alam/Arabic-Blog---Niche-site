import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales } from '@/lib/i18n'
import {
  getCategoriesWithCounts,
  getHomepageCategoriesWithPosts,
  getPostsByLocale,
  getSiteSettings,
} from '@/sanity/queries'
import { getSocialUrl, getTwitterHandle } from '@/lib/site'
import { getImageUrl } from '@/sanity/image'
import { websiteSchema, organizationSchema } from '@/lib/schema'
import Hero from '@/components/home/Hero'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import CategoryShelves from '@/components/home/CategoryShelves'
import TopPicksRibbon from '@/components/home/TopPicksRibbon'
import HomeFaq from '@/components/home/HomeFaq'
import TrustStrip from '@/components/home/TrustStrip'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Static HTML, cached until the Sanity webhook fires revalidateTag/revalidatePath.
export const revalidate = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = locales.includes(locale as Locale) ? (locale as Locale) : 'ar'
  return {
    alternates: {
      canonical: `/${l}`,
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale

  // Fetch all data concurrently in parallel
  const [categoriesWithPosts, categories, latestPosts, settings] = await Promise.all([
    getHomepageCategoriesWithPosts(l, 4),
    getCategoriesWithCounts(l),
    getPostsByLocale(l, 4),
    getSiteSettings(),
  ])

  const siteName =
    l === 'ar'
      ? settings?.siteNameAr || 'موقع المنزل والمطبخ'
      : settings?.siteNameEn || 'Home & Kitchen Guide'

  // WebSite + Organization JSON-LD — sameAs lists only real profile URLs
  const twitterHandle = getTwitterHandle(settings)
  const sameAs = [
    getSocialUrl(settings?.facebook),
    getSocialUrl(settings?.instagram),
    getSocialUrl(settings?.youtube),
    getSocialUrl(settings?.tiktok),
    getSocialUrl(settings?.pinterest),
    twitterHandle ? `https://twitter.com/${twitterHandle.replace('@', '')}` : undefined,
  ].filter((u): u is string => Boolean(u))

  const websiteLd = websiteSchema({ name: siteName, language: l })
  const organizationLd = organizationSchema({
    name: siteName,
    logoUrl: getImageUrl(settings?.logo, { width: 512, height: 512 }),
    sameAs,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <main>
        {/* 1. Compact Authority Hero (Target H1 + Quick Category Pills + Search) */}
        <Hero locale={l} settings={settings} categories={categories} />

        {/* 2. Fresh & Trending Editorial Feed (Immediate Crawler & Index Bait) */}
        {latestPosts.length > 0 && (
          <FeaturedPosts locale={l} posts={latestPosts} />
        )}

        {/* 3. Category Silo Shelves (Category-Wise Article Blocks) */}
        <CategoryShelves locale={l} categories={categoriesWithPosts} />

        {/* 4. Quick Top 3 Buyer's Picks Ribbon (High Commercial Intent & Affiliate CTR) */}
        <TopPicksRibbon locale={l} />

        {/* 5. Topical Semantic Authority FAQ (LSI Keywords & Search Answer Depth) */}
        <HomeFaq locale={l} />

        {/* 6. Editorial E-E-A-T Trust Signals */}
        <TrustStrip locale={l} />
      </main>
    </>
  )
}
