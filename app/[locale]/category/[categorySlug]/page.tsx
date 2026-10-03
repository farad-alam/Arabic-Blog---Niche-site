import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales } from '@/lib/i18n'
import { getCategoryBySlug, getPostsByCategory, getAllCategorySlugs } from '@/sanity/queries'
import PostGrid from '@/components/blog/PostGrid'

// Static HTML, cached until the Sanity webhook fires revalidateTag('categories') / `category-${id}`.
export const revalidate = false

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, categorySlug: locale === 'ar' ? s.slugAr : s.slugEn }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>
}): Promise<Metadata> {
  const { locale, categorySlug } = await params
  if (!locales.includes(locale as Locale)) return {}
  const category = await getCategoryBySlug(categorySlug, locale as Locale)
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
  const category = await getCategoryBySlug(categorySlug, l)
  if (!category) notFound()
  
  const posts = await getPostsByCategory(category._id, l)

  const title = l === 'ar' ? category.titleAr : category.titleEn
  const description = l === 'ar' ? category.descriptionAr : category.descriptionEn

  return (
    <main className="min-h-screen bg-surface-base pt-12 pb-24">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-3xl">
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
      </header>
      
      <section aria-label={l === 'ar' ? 'مقالات القسم' : 'Category Articles'}>
        <PostGrid locale={l} posts={posts} title={l === 'ar' ? 'مقالات القسم' : 'Category Articles'} />
      </section>
    </main>
  )
}
