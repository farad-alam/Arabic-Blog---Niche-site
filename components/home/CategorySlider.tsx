import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import type { SanityCategory } from '@/sanity/queries'

interface CategorySliderProps {
  categories: SanityCategory[]
  locale: Locale
}

export default function CategorySlider({ categories, locale }: CategorySliderProps) {
  if (!categories || categories.length === 0) return null

  const isAr = locale === 'ar'

  return (
    <section className="py-12 border-y border-dark-border bg-dark-base relative overflow-hidden">
      {/* Optional: subtle gradient to indicate scrollability on edges */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-dark-base to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-dark-base to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-arabic-heading font-bold text-2xl text-text-primary mb-6">
          {isAr ? 'تصفح حسب الأقسام' : 'Browse by Category'}
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x rtl:space-x-reverse">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${locale}/category/${isAr ? cat.slugAr.current : cat.slugEn.current}`}
              className="snap-start shrink-0 bg-dark-card border border-dark-border rounded-xl p-5 flex items-center gap-4 hover:border-purple-primary hover:bg-purple-primary/5 transition-all group min-w-[200px]"
            >
              <div className="w-12 h-12 rounded-lg bg-dark-base flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-text-primary group-hover:text-purple-primary transition-colors text-lg">
                  {isAr ? cat.titleAr : cat.titleEn}
                </h3>
                <p className="text-text-muted text-xs mt-1">
                  {isAr ? 'عرض المقالات ←' : 'View Articles →'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
