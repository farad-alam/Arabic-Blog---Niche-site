import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Cairo, Tajawal, Outfit } from 'next/font/google'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import { baseMetadata } from '@/lib/seo'
import { getTwitterHandle } from '@/lib/site'
import { getImageUrl } from '@/sanity/image'
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = (locales.includes(locale as Locale) ? locale : 'ar') as Locale
  const settings = await getSiteSettings()

  const siteName =
    l === 'ar'
      ? settings?.siteNameAr || 'موقع المنزل والمطبخ'
      : settings?.siteNameEn || 'Home & Kitchen Guide'

  const title =
    l === 'ar'
      ? settings?.seoTitleAr || siteName
      : settings?.seoTitleEn || siteName

  const description =
    l === 'ar'
      ? settings?.seoDescriptionAr || ''
      : settings?.seoDescriptionEn || ''

  const faviconUrl = settings?.favicon?.asset?.url || '/icon.png'
  const appleTouchIconUrl = settings?.appleTouchIcon?.asset?.url || '/icon.png'
  // Crop to a true 1200x630 so the declared og:image dimensions match the file
  // (Sanity's default fit=clip would serve a smaller, differently-proportioned image).
  const ogImageUrl =
    getImageUrl(settings?.seoImage, { width: 1200, height: 630, crop: true }) ||
    '/opengraph-image.png'

  return {
    ...baseMetadata,
    title: {
      template: `%s | ${siteName}`,
      default: title,
    },
    description,
    icons: {
      icon: [
        { url: faviconUrl },
      ],
      apple: [
        { url: appleTouchIconUrl },
      ],
    },
    openGraph: {
      title,
      description,
      siteName,
      locale: l === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      // Only emit twitter:creator for a real handle — "@" alone is invalid
      creator: getTwitterHandle(settings),
    },
  }
}

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
