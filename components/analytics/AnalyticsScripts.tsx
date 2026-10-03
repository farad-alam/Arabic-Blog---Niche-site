import Script from 'next/script'
import { getSiteSettings } from '@/sanity/queries'

/**
 * AnalyticsScripts — Server Component
 *
 * Renders analytics/tracking <Script> tags conditionally.
 * Only scripts with a value set in Sanity → Site Settings → Analytics
 * are injected. Missing values = zero script tags = zero performance cost.
 *
 * Caching: getSiteSettings() uses React cache() + ISR tag 'siteSettings'.
 * The data is fetched ONCE per server render tree and cached between requests.
 * It only re-fetches after the Sanity webhook fires (when you save in Studio).
 */
export default async function AnalyticsScripts() {
  const settings = await getSiteSettings()
  if (!settings) return null

  const { gaId } = settings

  return (
    <>
      {/* ── Google Analytics 4 ────────────────────────────────────────────── */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

    </>
  )
}
