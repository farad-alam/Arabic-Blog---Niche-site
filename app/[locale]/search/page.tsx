import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales, t } from '@/lib/i18n'
import SearchClient from '@/components/search/SearchClient'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) return {}
  return {
    title: t(locale as Locale, 'search.title'),
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const l = locale as Locale

  return (
    <main className="min-h-screen bg-surface-base pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-arabic-heading font-bold text-3xl md:text-4xl text-text-primary mb-8">
          {t(l, 'search.title')}
        </h1>
        {/* useSearchParams() inside needs a Suspense boundary for static rendering */}
        <Suspense fallback={<p className="text-text-muted">{t(l, 'search.loading')}</p>}>
          <SearchClient locale={l} />
        </Suspense>
      </div>
    </main>
  )
}
