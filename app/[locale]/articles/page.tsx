import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales, t } from '@/lib/i18n'
import { getPostsByLocale } from '@/sanity/queries'
import PostGrid from '@/components/blog/PostGrid'

// ISR: webhook fires revalidateTag('posts') to bust this when new posts are published
export const revalidate = 0

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) return {}
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'جميع المقالات' : 'All Articles',
    description: isAr
      ? 'تصفح جميع مراجعاتنا وأدلة الشراء ومقالاتنا.'
      : 'Browse all of our reviews, buying guides and articles.',
    alternates: { canonical: `/${locale}/articles` },
  }
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const l = locale as Locale

  const posts = await getPostsByLocale(l, 100)

  return (
    <main className="min-h-screen bg-surface-base pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="font-arabic-heading font-bold text-3xl md:text-5xl text-text-primary">
          {l === 'ar' ? 'جميع المقالات' : 'All Articles'}
        </h1>
        <p className="text-text-muted mt-3 max-w-2xl">
          {posts.length} {t(l, 'home.articlesCount')}
        </p>
      </div>
      <PostGrid locale={l} posts={posts} title={t(l, 'home.latest')} />
    </main>
  )
}
