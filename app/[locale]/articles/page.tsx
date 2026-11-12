import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales } from '@/lib/i18n'
import ArticlesListing, { articlesMetadata } from '@/components/blog/ArticlesListing'

// Static HTML, cached until the Sanity webhook fires revalidateTag('posts').
export const revalidate = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) return {}
  return articlesMetadata(locale as Locale, 1)
}

/** Page 1 of the archive. Further pages live at /[locale]/articles/page/[page]. */
export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  return <ArticlesListing l={locale as Locale} page={1} />
}
