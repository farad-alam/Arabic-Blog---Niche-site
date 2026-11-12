import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, locales } from '@/lib/i18n'
import ArticlesListing, { articlesMetadata } from '@/components/blog/ArticlesListing'

// Rendered on first visit, then cached until the Sanity webhook clears the 'posts' tag.
export const revalidate = false

function parsePage(raw: string): number | null {
  return /^\d+$/.test(raw) ? Number(raw) : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>
}): Promise<Metadata> {
  const { locale, page } = await params
  const n = parsePage(page)
  if (!locales.includes(locale as Locale) || !n) return {}
  return articlesMetadata(locale as Locale, n)
}

/** Archive pages 2, 3, … (page 1 is /[locale]/articles). */
export default async function ArticlesPaginatedPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>
}) {
  const { locale, page } = await params
  const n = parsePage(page)
  if (!locales.includes(locale as Locale) || !n || n < 1) notFound()
  if (n === 1) redirect(`/${locale}/articles`)
  return <ArticlesListing l={locale as Locale} page={n} />
}
