import { notFound } from 'next/navigation'
import { type Locale, locales, t } from '@/lib/i18n'
import { getCategoriesWithCounts, getPostsByLocale, getSiteSettings } from '@/sanity/queries'
import Hero from '@/components/home/Hero'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import CategoryGrid from '@/components/home/CategoryGrid'
import TrustStrip from '@/components/home/TrustStrip'
import PostGrid from '@/components/blog/PostGrid'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Static HTML, cached until the Sanity webhook fires revalidateTag/revalidatePath.
export const revalidate = false

/** Number of stories shown in the featured block (1 lead + 3 side) */
const FEATURED_COUNT = 4

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale

  // Fetch data concurrently
  const [categories, posts, settings] = await Promise.all([
    getCategoriesWithCounts(l),
    getPostsByLocale(l, 10),
    getSiteSettings(),
  ])

  const featured = posts.slice(0, FEATURED_COUNT)
  const latest = posts.slice(FEATURED_COUNT)

  return (
    <main>
      <Hero locale={l} settings={settings} categories={categories} />

      {posts.length === 0 ? (
        <PostGrid locale={l} posts={[]} />
      ) : (
        <FeaturedPosts locale={l} posts={featured} />
      )}

      <CategoryGrid locale={l} categories={categories} />

      <PostGrid
        locale={l}
        posts={latest}
        title={t(l, 'home.latest')}
        viewAllHref={`/${l}/articles`}
        hideWhenEmpty
      />

      <TrustStrip locale={l} />
    </main>
  )
}
