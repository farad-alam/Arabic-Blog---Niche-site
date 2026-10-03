import type { Metadata } from 'next'
import type { Locale } from './i18n'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
const SITE_NAME_AR = process.env.NEXT_PUBLIC_SITE_NAME_AR ?? ''
const SITE_NAME_EN = process.env.NEXT_PUBLIC_SITE_NAME_EN ?? ''

/** Resolve the site name for a given locale */
export function getSiteName(locale: Locale): string {
  return locale === 'ar' ? SITE_NAME_AR : SITE_NAME_EN
}

/**
 * Base metadata applied to every page.
 * Each page overrides specific fields via generateMetadata().
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
  },
}
