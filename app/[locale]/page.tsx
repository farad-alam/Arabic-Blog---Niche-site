import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales } from '@/lib/i18n'
import {
  getCategoriesWithCounts,
  getFeaturedPicks,
  getFaqItems,
  getHomepageCategoriesWithPosts,
  getPostsByLocale,
  getSiteSettings,
} from '@/sanity/queries'
import { getSiteName, getSocialUrl, getTwitterHandle } from '@/lib/site'
import { getImageUrl } from '@/sanity/image'
import { websiteSchema, organizationSchema } from '@/lib/schema'
import Hero from '@/components/home/Hero'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import CategoryShelves from '@/components/home/CategoryShelves'
import TopPicksRibbon, { type PickEntry } from '@/components/home/TopPicksRibbon'
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

const BADGE_CLASSES: Record<string, string> = {
  amber: 'bg-amber-400 text-stone-950',
  emerald: 'bg-emerald-500 text-white',
  purple: 'bg-purple-600 text-white',
  blue: 'bg-blue-600 text-white',
  rose: 'bg-rose-500 text-white',
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale
  const isAr = l === 'ar'

  // Fetch all data concurrently in parallel
  const [categoriesWithPosts, categories, latestPosts, settings, faqs, picks] = await Promise.all([
    getHomepageCategoriesWithPosts(l, 4),
    getCategoriesWithCounts(l),
    getPostsByLocale(l, 4),
    getSiteSettings(),
    getFaqItems(l),
    getFeaturedPicks(),
  ])

  const siteName = getSiteName(settings, l)

  // Resolve featured picks for the current locale
  const resolvedPicks: PickEntry[] = picks.map((p) => {
    const postRef = isAr ? p.postRefAr : p.postRefEn
    return {
      badge: isAr ? p.badgeAr : p.badgeEn,
      badgeClass: BADGE_CLASSES[p.badgeColor ?? 'amber'] ?? BADGE_CLASSES.amber,
      title: isAr ? p.titleAr : p.titleEn,
      specs: isAr ? p.specsAr : p.specsEn,
      verdict: isAr ? p.verdictAr : p.verdictEn,
      rating: p.rating,
      href: postRef?.slug?.current ? `/${l}/${postRef.slug.current}` : undefined,
    }
  })

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
        <TopPicksRibbon
          locale={l}
          picks={resolvedPicks}
          badge={isAr ? settings?.picksBadgeAr : settings?.picksBadgeEn}
          heading={isAr ? settings?.picksHeadingAr : settings?.picksHeadingEn}
          subheading={isAr ? settings?.picksSubheadingAr : settings?.picksSubheadingEn}
          cta={isAr ? settings?.picksCtaAr : settings?.picksCtaEn}
        />

        {/* 5. Topical Semantic Authority FAQ (LSI Keywords & Search Answer Depth) */}
        <HomeFaq
          locale={l}
          faqs={faqs}
          badge={isAr ? settings?.faqBadgeAr : settings?.faqBadgeEn}
          heading={isAr ? settings?.faqHeadingAr : settings?.faqHeadingEn}
        />

        {/* 6. Editorial E-E-A-T Trust Signals */}
        <TrustStrip locale={l} testingLine={isAr ? settings?.trustLineAr : settings?.trustLineEn} />
      </main>
    </>
  )
}
