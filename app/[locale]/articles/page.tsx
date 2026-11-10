import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales, t } from '@/lib/i18n'
import { getPostsByLocale, getSiteSettings } from '@/sanity/queries'
import { getSiteName } from '@/lib/site'
import { breadcrumbSchema, BASE_URL } from '@/lib/schema'
import PostGrid from '@/components/blog/PostGrid'

// Static HTML, cached until the Sanity webhook fires revalidateTag('posts').
export const revalidate = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) return {}
  const l = locale as Locale
  const settings = await getSiteSettings()
  const siteName = getSiteName(settings, l)
  const description =
    (l === 'ar' ? settings?.seoDescriptionAr : settings?.seoDescriptionEn) || siteName

  return {
    title: t(l, 'category.allArticles'),
    description,
    alternates: {
      canonical: `/${l}/articles`,
      // Both language versions exist, so pair them for Google.
      languages: {
        ar: '/ar/articles',
        en: '/en/articles',
        'x-default': '/ar/articles',
      },
    },
  }
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const l = locale as Locale

  // 500 is far above the current article count; add pagination if it is ever reached.
  const posts = await getPostsByLocale(l, 500)
  const title = t(l, 'category.allArticles')

  const crumbs = [
    { name: t(l, 'breadcrumb.home'), url: `${BASE_URL}/${l}` },
    { name: title, url: `${BASE_URL}/${l}/articles` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
      <main className="min-h-screen bg-surface-base pt-12 pb-24">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <h1 className="font-arabic-heading font-bold text-3xl md:text-4xl text-text-primary">
            {title}
          </h1>
        </header>
        <PostGrid locale={l} posts={posts} title={`${posts.length} ${t(l, 'home.articlesCount')}`} />
      </main>
    </>
  )
}
