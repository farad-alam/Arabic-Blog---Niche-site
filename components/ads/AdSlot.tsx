import { getSiteSettings } from '@/sanity/queries'
import type { Locale } from '@/lib/i18n'

interface AdSlotProps {
  locale: Locale
  /** rectangle = 300×250 (in-content), tall = 300×600 (sidebar) */
  size?: 'rectangle' | 'tall'
  /** extra classes, e.g. visibility per breakpoint: "xl:hidden" */
  className?: string
  /**
   * AdSense slot ID for this specific ad unit.
   * Find it in AdSense → Ads → By ad unit → Get code.
   * Leave undefined to use auto ads or while AdSense is not yet set up.
   */
  slotId?: string
}

const HEIGHTS: Record<NonNullable<AdSlotProps['size']>, string> = {
  rectangle: 'min-h-[280px]',
  tall: 'min-h-[250px] xl:min-h-[600px]',
}

/**
 * AdSlot — Server Component
 *
 * Behaviour:
 * - AdSense NOT configured in Sanity → renders nothing (no grey box, no text).
 * - AdSense configured, no slotId → renders a height-reserved empty div
 *   (useful for auto ads while you haven't created named units yet).
 * - AdSense configured, slotId provided → renders the real <ins> tag.
 *
 * No env vars needed. Set adsenseClient in Sanity → Site Settings → Analytics.
 * The webhook busts the cache; next visitor gets live ads. Zero redeploy.
 */
export default async function AdSlot({ locale, size = 'rectangle', className = '', slotId }: AdSlotProps) {
  const settings = await getSiteSettings()
  const adsenseClient = settings?.adsenseClient

  // Nothing configured — render nothing (no placeholder visible to users)
  if (!adsenseClient) return null

  const isAr = locale === 'ar'

  return (
    <aside
      aria-label={isAr ? 'إعلان' : 'Advertisement'}
      className={`my-8 ${className}`}
    >
      <p className="text-center text-[11px] text-text-muted/70 mb-1.5 tracking-wide">
        {isAr ? 'إعلان' : 'Advertisement'}
      </p>
      {slotId ? (
        // Named ad unit — renders the real AdSense <ins> tag
        <ins
          className={`adsbygoogle block ${HEIGHTS[size]}`}
          style={{ display: 'block' }}
          data-ad-client={adsenseClient}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        // No slot ID yet — reserve the height so layout doesn't jump later
        <div className={`ad-slot ${HEIGHTS[size]}`} />
      )}
    </aside>
  )
}
