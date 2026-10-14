import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { BASE_URL } from '@/lib/config'

/**
 * Root layout — minimal pass-through.
 *
 * In Next.js App Router, ALL routes under app/[locale]/ will be rendered
 * through app/[locale]/layout.tsx which sets the correct html lang+dir+fonts.
 *
 * This root layout exists only because Next.js requires a root layout.
 * It renders no html/body — those are handled by [locale]/layout.tsx.
 *
 * The only route NOT under [locale] is /studio — it uses its own layout.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // html/body/fonts/CSS are all handled in app/[locale]/layout.tsx
  // This wrapper is required by Next.js but stays minimal
  return children as React.ReactElement
}
