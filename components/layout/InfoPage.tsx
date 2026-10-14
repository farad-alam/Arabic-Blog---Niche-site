import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales, t } from '@/lib/i18n'
import { getSiteName } from '@/lib/site'
import { getSiteSettings, getStaticPage } from '@/sanity/queries'

/** Keys of the four CMS-driven info pages. */
export type InfoPageKey = 'about' | 'privacy' | 'terms' | 'disclosure'

/** generateMetadata helper for the info pages */
export async function infoMetadata(key: InfoPageKey, localeParam: string): Promise<Metadata> {
  if (!locales.includes(localeParam as Locale)) return {}
  const locale = localeParam as Locale
  const [settings, page] = await Promise.all([getSiteSettings(), getStaticPage(key)])
  const title = page ? (locale === 'ar' ? page.titleAr : page.titleEn) : getSiteName(settings, locale)
  const description =
    (locale === 'ar' ? page?.descriptionAr : page?.descriptionEn) ?? ''
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/${key}` },
  }
}

/** Shared, nicely-styled layout for About / Privacy / Terms / Disclosure */
export default async function InfoPage({
  pageKey,
  localeParam,
}: {
  pageKey: InfoPageKey
  localeParam: string
}) {
  if (!locales.includes(localeParam as Locale)) notFound()
  const locale = localeParam as Locale
  const page = await getStaticPage(pageKey)

  // Page not configured in the CMS yet — friendly placeholder, not a 404.
  if (!page) {
    return (
      <main className="min-h-screen bg-surface-base flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-arabic-heading font-bold text-2xl text-text-primary mb-3">
            {locale === 'ar' ? 'قيد الإعداد' : 'Coming soon'}
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            {locale === 'ar'
              ? 'هذه الصفحة لم تتم إضافتها بعد. يمكنك إنشاؤها من لوحة التحكم: Sanity ← الصفحات الثابتة.'
              : 'This page has not been set up yet. Create it in Sanity → Static Pages.'}
          </p>
        </div>
      </main>
    )
  }

  const title = locale === 'ar' ? page.titleAr : page.titleEn
  const intro = locale === 'ar' ? page.introAr : page.introEn
  const sections = (page.sections ?? []).map((s) => ({
    heading: locale === 'ar' ? s.headingAr : s.headingEn,
    paragraphs: (locale === 'ar' ? s.paragraphsAr : s.paragraphsEn) ?? [],
  }))

  return (
    <main className="min-h-screen bg-surface-base pb-24">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-surface-border">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-primary/15 blur-[110px] rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-5 flex items-center gap-2">
            <Link href={`/${locale}`} className="hover:text-brand-primary transition-colors">
              {t(locale, 'breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="text-text-primary">{title}</span>
          </nav>
          <h1 className="font-arabic-heading font-bold text-3xl md:text-5xl text-text-primary mb-5">{title}</h1>
          {intro && <p className="text-text-muted text-base md:text-lg leading-relaxed">{intro}</p>}
        </div>
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-arabic-heading font-bold text-xl md:text-2xl text-text-primary mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-brand-primary to-brand-gradient" />
              {section.heading}
            </h2>
            <div className="space-y-4">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-text-muted leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </main>
  )
}
