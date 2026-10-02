import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales } from '@/lib/i18n'
import { getCategory, getPostsByCategory, getCategorySlugs } from '@/sanity/queries'
import PostGrid from '@/components/blog/PostGrid'

export const revalidate = false

export async function generateStaticParams() {
  const slugs = await getCategorySlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, categorySlug: slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>
}): Promise<Metadata> {
  const { locale, categorySlug } = await params
  if (!locales.includes(locale as Locale)) return {}
  const category = await getCategory(categorySlug, locale as Locale)
  if (!category) return {}

  const title = locale === 'ar' ? category.titleAr : category.titleEn
  const description = locale === 'ar' ? category.descriptionAr : category.descriptionEn

  return {
    title,
    description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>
}) {
  const { locale, categorySlug } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale
  const [category, posts] = await Promise.all([
    getCategory(categorySlug, l),
    getPostsByCategory(categorySlug, l),
  ])

  if (!category) notFound()

  const title = l === 'ar' ? category.titleAr : category.titleEn
  const description = l === 'ar' ? category.descriptionAr : category.descriptionEn

  return (
    <main className="min-h-screen bg-dark-base pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-3xl">
            {category.icon}
          </div>
          <div>
            <h1 className="font-arabic-heading font-bold text-3xl md:text-4xl text-text-primary">
              {title}
            </h1>
            {description && (
              <p className="text-text-muted mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <PostGrid locale={l} posts={posts} title={l === 'ar' ? 'مقالات القسم' : 'Category Articles'} />
    </main>
  )
}
