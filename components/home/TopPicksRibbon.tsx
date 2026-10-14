import Link from 'next/link'
import { type Locale } from '@/lib/i18n'

export interface PickEntry {
  badge: string
  badgeClass: string
  title: string
  specs?: string
  verdict?: string
  rating?: number
  href?: string
}

interface TopPicksRibbonProps {
  locale: Locale
  /** CMS-driven picks (already resolved for the locale) */
  picks: PickEntry[]
  badge?: string
  heading?: string
  subheading?: string
  cta?: string
}

export default function TopPicksRibbon({ locale, picks, badge, heading, subheading, cta }: TopPicksRibbonProps) {
  const isAr = locale === 'ar'

  if (picks.length === 0) return null

  const sectionBadge = badge || (isAr ? 'اختيارات الخبراء' : "EDITOR'S BENCHMARK")
  const sectionHeading = heading || (isAr ? 'أفضل المنتجات ترشيحاً' : 'Top Recommended Products')
  const sectionCta = cta || (isAr ? 'قراءة المراجعة والمواصفات' : 'Read Full Review')

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
          {sectionBadge}
        </span>
        <h2 className="font-arabic-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-text-primary">
          {sectionHeading}
        </h2>
        {subheading && (
          <p className="font-body text-text-muted text-sm sm:text-base mt-2">{subheading}</p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {picks.map((pick, i) => {
          const card = (
            <div className="flex flex-col h-full bg-surface-card rounded-2xl border border-surface-border p-6 hover:border-brand-primary/50 hover:shadow-card-hover transition-all duration-300 relative">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${pick.badgeClass}`}>
                  {pick.badge}
                </span>
                {typeof pick.rating === 'number' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-text-primary">
                    <span className="text-amber-400">★</span>
                    <span>{pick.rating}</span>
                  </span>
                )}
              </div>

              {/* Model Name */}
              <h3 className="font-arabic-heading font-bold text-lg text-text-primary mb-2">
                {pick.title}
              </h3>

              {/* Specs */}
              {pick.specs && <p className="text-xs text-brand-primary font-medium mb-3">{pick.specs}</p>}

              {/* Verdict */}
              {pick.verdict && (
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6 flex-1">
                  {pick.verdict}
                </p>
              )}

              {/* Link */}
              {pick.href && (
                <span className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white font-bold text-xs py-3 rounded-xl transition-colors mt-auto">
                  <span>{sectionCta}</span>
                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true">
                    {isAr ? '←' : '→'}
                  </span>
                </span>
              )}
            </div>
          )

          return pick.href ? (
            <Link key={i} href={pick.href} className="group flex">
              {card}
            </Link>
          ) : (
            <div key={i} className="flex">
              {card}
            </div>
          )
        })}
      </div>
    </section>
  )
}
