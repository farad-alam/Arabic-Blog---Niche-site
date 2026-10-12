import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import {
  getCategoriesWithCounts,
  getHomepageCategoriesWithPosts,
  getPostsByLocale,
  getSiteSettings,
} from '@/sanity/queries'
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

  return (
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
  )
}
