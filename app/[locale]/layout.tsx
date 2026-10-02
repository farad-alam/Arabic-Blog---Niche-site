import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Cairo, Tajawal, Outfit } from 'next/font/google'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import { baseMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/sanity/queries'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
import AnalyticsScripts from '@/components/analytics/AnalyticsScripts'
import '@/styles/globals.css'

// ── Arabic fonts ──────────────────────────────────────────────────────────────
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic-heading',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  variable: '--font-arabic-body',
  weight: ['400', '500', '700'],
  display: 'swap',
})

// ── Latin font ────────────────────────────────────────────────────────────────
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = baseMetadata

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const isRtl = locale === 'ar'

  // Fetch siteSettings once — React cache() ensures this is shared with
  // NavbarWrapper, FooterWrapper, and AnalyticsScripts without extra API calls.
  const settings = await getSiteSettings()

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${cairo.variable} ${tajawal.variable} ${outfit.variable}`}
    >
      <head>
        {/* ── Verification meta tags (from Sanity) ─────────────────────── */}
        {settings?.gscVerification && (
          <meta name="google-site-verification" content={settings.gscVerification} />
        )}
        {settings?.bingVerification && (
          <meta name="msvalidate.01" content={settings.bingVerification} />
        )}
      </head>
      <body>
        <NavbarWrapper locale={locale as Locale} />
        <div className="pt-16">
          {children}
        </div>
        <FooterWrapper locale={locale as Locale} />

        {/*
          Analytics scripts — sourced from Sanity Site Settings.
          Only scripts with a value set in Sanity are injected.
          All use afterInteractive strategy — zero impact on LCP/FCP.
        */}
        <AnalyticsScripts />
      </body>
    </html>
  )
}
