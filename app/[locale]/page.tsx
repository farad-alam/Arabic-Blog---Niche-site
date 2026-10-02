import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import { getTopLevelCategories, getPostsByLocale } from '@/sanity/queries'
import Hero from '@/components/home/Hero'
import CategorySlider from '@/components/home/CategorySlider'
import PostGrid from '@/components/blog/PostGrid'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// ISR: revalidate when webhooks fire (managed globally by tags in sanity queries)
export const revalidate = false

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale

  // Fetch data concurrently
  const [categories, latestPosts] = await Promise.all([
    getTopLevelCategories(),
    getPostsByLocale(l, 6), // Fetch 6 most recent posts
  ])

  return (
    <main>
      <Hero locale={l} />
      <CategorySlider locale={l} categories={categories} />
      <div className="bg-dark-base">
        <PostGrid 
          locale={l} 
          posts={latestPosts} 
          title={l === 'ar' ? 'أحدث المقالات والمراجعات' : 'Latest Articles & Reviews'}
        />
      </div>
    </main>
  )
}
