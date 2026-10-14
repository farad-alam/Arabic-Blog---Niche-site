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

  const { gaId, adsenseClient, clarityId, hotjarId } = settings

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

      {/* ── Microsoft Clarity ─────────────────────────────────────────────── */}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* ── Hotjar ────────────────────────────────────────────────────────── */}
      {hotjarId && (
        <Script id="hotjar" strategy="lazyOnload">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${hotjarIdNumeric(hotjarId)},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* ── Google AdSense ────────────────────────────────────────────────── */}
      {/* Only rendered when adsenseClient is saved in Sanity Site Settings.  */}
      {/* Set it to ca-pub-XXXXXXXX once your site is approved by AdSense.    */}
      {adsenseClient && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  )
}

/** Hotjar site IDs are numeric — strip any non-digit characters editors may paste. */
function hotjarIdNumeric(raw: string): string {
  return raw.replace(/\D/g, '') || '0'
}
