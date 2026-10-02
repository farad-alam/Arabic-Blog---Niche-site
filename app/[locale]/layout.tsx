import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Cairo, Tajawal, Outfit } from 'next/font/google'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import { baseMetadata } from '@/lib/seo'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import FooterWrapper from '@/components/layout/FooterWrapper'
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${cairo.variable} ${tajawal.variable} ${outfit.variable}`}
    >
      <head>
        {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
        )}
      </head>
      <body>
        <NavbarWrapper locale={locale as Locale} />
        <div className="pt-16">
          {children}
        </div>
        <FooterWrapper locale={locale as Locale} />

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
