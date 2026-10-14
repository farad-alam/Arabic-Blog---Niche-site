import type { Metadata } from 'next'
import { BASE_URL } from './config'

/**
 * Base metadata applied to every page.
 * Each page overrides specific fields via generateMetadata().
 * Site verification tags are injected from Sanity in app/[locale]/layout.tsx.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}
