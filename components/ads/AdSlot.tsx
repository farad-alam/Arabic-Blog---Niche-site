import type { Locale } from '@/lib/i18n'

interface AdSlotProps {
  locale: Locale
  /** rectangle = 300×250 (in-content), tall = 300×600 (sidebar) */
  size?: 'rectangle' | 'tall'
  /** extra classes, e.g. visibility per breakpoint: "xl:hidden" */
  className?: string
  label?: string
}

const HEIGHTS: Record<NonNullable<AdSlotProps['size']>, string> = {
  rectangle: 'min-h-[280px]',
  tall: 'min-h-[250px] xl:min-h-[600px]',
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

/**
 * AdSense slot. Returns null until NEXT_PUBLIC_ADSENSE_CLIENT is set in env.
 * Height is reserved up-front so the page never jumps when the real ad loads (CLS).
 * Replace the inner <div> with the <ins> tag once AdSense is approved.
 */
export default function AdSlot({ locale, size = 'rectangle', className = '' }: AdSlotProps) {
  // Hide completely until AdSense is configured — prevents showing placeholder text to visitors
  if (!ADSENSE_CLIENT) return null

  const isAr = locale === 'ar'
  return (
    <aside
      aria-label={isAr ? 'إعلان' : 'Advertisement'}
      className={`my-8 ${className}`}
    >
      <p className="text-center text-[11px] text-text-muted/70 mb-1.5 tracking-wide">
        {isAr ? 'إعلان' : 'Advertisement'}
      </p>
      <div className={`ad-slot ${HEIGHTS[size]}`}>
        {/* Replace this div with your <ins class="adsbygoogle"> tag */}
      </div>
    </aside>
  )
}
