import type { Metadata } from 'next'
import { locales } from '@/lib/i18n'
import InfoPage, { infoMetadata } from '@/components/layout/InfoPage'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return infoMetadata('about', (await params).locale)
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  return <InfoPage pageKey="about" localeParam={(await params).locale} />
}
