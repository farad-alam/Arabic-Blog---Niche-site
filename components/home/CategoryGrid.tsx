import Link from 'next/link'
import { type Locale, t } from '@/lib/i18n'
import type { SanityCategory } from '@/sanity/queries'
import SectionHeading from '@/components/ui/SectionHeading'

interface CategoryGridProps {
  locale: Locale
  categories: SanityCategory[]
}

/** Category cards with icon, description and article count. Hidden when empty. */
export default function CategoryGrid({ locale, categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null
  const isAr = locale === 'ar'

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <SectionHeading title={t(locale, 'home.browse')} isRtl={isAr} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const title = isAr ? cat.titleAr : cat.titleEn
          const description = isAr ? cat.descriptionAr : cat.descriptionEn
          return (
            <Link
              key={cat._id}
              href={`/${locale}/category/${isAr ? cat.slugAr.current : cat.slugEn.current}`}
              className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-6 hover:border-purple-primary/50 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-purple-primary/10 blur-2xl group-hover:bg-purple-primary/25 transition-colors" />
              <div className="relative flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {cat.icon ?? '📁'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-arabic-heading font-bold text-lg text-text-primary group-hover:text-purple-light transition-colors">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-sm text-text-muted mt-1 line-clamp-2 !leading-relaxed !text-sm">{description}</p>
                  )}
                  {typeof cat.postCount === 'number' && (
                    <span className="inline-block mt-3 text-xs text-purple-primary font-medium">
                      {cat.postCount} {t(locale, 'home.articlesCount')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
