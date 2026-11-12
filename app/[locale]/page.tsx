import { Fragment, type ReactNode } from 'react'
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
import { getSanityCdnUrl } from '@/sanity/image'
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
      languages: { ar: '/ar', en: '/en', 'x-default': '/ar' },
    },
  }
}

type HomeSectionKey = 'latest' | 'categories' | 'picks' | 'faq' | 'trust'
const DEFAULT_SECTION_ORDER: HomeSectionKey[] = ['latest', 'categories', 'picks', 'faq', 'trust']

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
    logoUrl: getSanityCdnUrl(settings?.logo?.asset?.url, 256),
    sameAs,
  })

  // Each homepage block, keyed by the value used in Site Settings → Homepage Sections.
  const sections: Record<HomeSectionKey, ReactNode> = {
    // Fresh & trending editorial feed (crawler + index bait)
    latest: latestPosts.length > 0 ? <FeaturedPosts locale={l} posts={latestPosts} /> : null,
    // Category silo shelves
    categories: <CategoryShelves locale={l} categories={categoriesWithPosts} />,
    // Top buyer's picks ribbon (commercial intent + affiliate CTR)
    picks: (
      <TopPicksRibbon
        locale={l}
        picks={resolvedPicks}
        badge={isAr ? settings?.picksBadgeAr : settings?.picksBadgeEn}
        heading={isAr ? settings?.picksHeadingAr : settings?.picksHeadingEn}
        subheading={isAr ? settings?.picksSubheadingAr : settings?.picksSubheadingEn}
        cta={isAr ? settings?.picksCtaAr : settings?.picksCtaEn}
      />
    ),
    // Topical authority FAQ
    faq: (
      <HomeFaq
        locale={l}
        faqs={faqs}
        badge={isAr ? settings?.faqBadgeAr : settings?.faqBadgeEn}
        heading={isAr ? settings?.faqHeadingAr : settings?.faqHeadingEn}
      />
    ),
    // E-E-A-T trust signals
    trust: <TrustStrip locale={l} testingLine={isAr ? settings?.trustLineAr : settings?.trustLineEn} />,
  }
  const configured = (settings?.homepageSections ?? []).filter(
    (k): k is HomeSectionKey => k in sections,
  )
  const sectionOrder = configured.length > 0 ? [...new Set(configured)] : DEFAULT_SECTION_ORDER

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

        {/* Sections below the hero — order & visibility come from Studio →
            Site Settings → Homepage Sections (empty = all, default order). */}
        {sectionOrder.map((key) => (
          <Fragment key={key}>{sections[key]}</Fragment>
        ))}
      </main>
    </>
  )
}
