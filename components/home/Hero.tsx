import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import { getHeroCopy } from '@/lib/site'
import type { SanityCategory, SanitySiteSettings } from '@/sanity/queries'
import HeroSearch from './HeroSearch'

interface HeroProps {
  locale: Locale
  settings: SanitySiteSettings | null
  categories: SanityCategory[]
}

export default function Hero({ locale, settings, categories }: HeroProps) {
  const isAr = locale === 'ar'
  const copy = getHeroCopy(settings, locale)
  const chips = categories.slice(0, 5)

  return (
    <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-purple-primary/10 blur-[140px] rounded-full opacity-50" />
        <div className="absolute -bottom-24 -start-24 w-[360px] h-[360px] bg-purple-gradient/8 blur-[110px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#7D40FF 1px, transparent 1px), linear-gradient(90deg, #7D40FF 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 bg-purple-primary/10 border border-purple-primary/25 text-purple-light text-xs sm:text-sm font-body px-4 py-1.5 rounded-full mb-7">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-purple-primary opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-purple-primary" />
          </span>
          {copy.badge}
        </span>

        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.25] md:leading-[1.2] mb-6 max-w-4xl mx-auto">
          {copy.heading}
          <span className="text-gradient">{copy.highlight}</span>
        </h1>

        <p className="font-body text-text-muted text-base md:text-xl max-w-2xl mx-auto mb-10 leading-[1.9]">
          {copy.subheading}
        </p>

        <HeroSearch locale={locale} />

        {chips.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-text-muted me-1">{isAr ? 'الأكثر بحثاً:' : 'Popular:'}</span>
            {chips.map((cat) => (
              <Link
                key={cat._id}
                href={`/${locale}/category/${isAr ? cat.slugAr.current : cat.slugEn.current}`}
                className="text-xs sm:text-sm text-text-muted hover:text-purple-primary border border-surface-border hover:border-purple-primary hover:bg-purple-primary/10 px-3.5 py-1.5 rounded-full transition-all"
              >
                {cat.icon && <span className="me-1.5">{cat.icon}</span>}
                {isAr ? cat.titleAr : cat.titleEn}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
