import type { Metadata } from 'next'
import { Studio } from './Studio'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  return <Studio />
}
