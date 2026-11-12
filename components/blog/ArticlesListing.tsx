import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { type Locale, t } from '@/lib/i18n'
import { getPostsPage, getSiteSettings } from '@/sanity/queries'
import { getSiteName } from '@/lib/site'
import { breadcrumbSchema, BASE_URL } from '@/lib/schema'
import PostGrid from '@/components/blog/PostGrid'

/** Articles per page of the archive. Raise/lower per site if you like. */
export const ARTICLES_PAGE_SIZE = 24

const pagePath = (l: Locale, page: number) =>
  page <= 1 ? `/${l}/articles` : `/${l}/articles/page/${page}`

/** generateMetadata for /articles and /articles/page/[page] */
export async function articlesMetadata(l: Locale, page: number): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = getSiteName(settings, l)
  const description =
    (l === 'ar' ? settings?.seoDescriptionAr : settings?.seoDescriptionEn) || siteName
  const base = t(l, 'category.allArticles')

  return {
    title: page > 1 ? `${base} – ${t(l, 'pagination.page')} ${page}` : base,
    description,
    alternates: {
      canonical: pagePath(l, page),
      // Same page number exists in both languages only while both archives are that long;
      // hreflang is therefore only emitted for the first page.
      ...(page === 1
        ? { languages: { ar: '/ar/articles', en: '/en/articles', 'x-default': '/ar/articles' } }
        : {}),
    },
  }
}

/** Server component: one page of the article archive with Prev/Next links. */
export default async function ArticlesListing({ l, page }: { l: Locale; page: number }) {
  const { posts, total } = await getPostsPage(l, page, ARTICLES_PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PAGE_SIZE))
  if (page > totalPages || (posts.length === 0 && page > 1)) notFound()

  const title = t(l, 'category.allArticles')
  const crumbs = [
    { name: t(l, 'breadcrumb.home'), url: `${BASE_URL}/${l}` },
    { name: title, url: `${BASE_URL}/${l}/articles` },
  ]
  const linkCls =
    'inline-flex items-center min-h-[44px] px-5 rounded-lg border border-surface-border bg-surface-card text-text-primary font-semibold hover:border-brand-primary hover:text-brand-primary transition-colors'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
      <main className="min-h-screen bg-surface-base pt-12 pb-24">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <h1 className="font-arabic-heading font-bold text-3xl md:text-4xl text-text-primary">
            {title}
          </h1>
        </header>
        <PostGrid locale={l} posts={posts} title={`${total} ${t(l, 'home.articlesCount')}`} />

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex items-center justify-between gap-4"
          >
            {page > 1 ? (
              <Link href={pagePath(l, page - 1)} rel="prev" className={linkCls}>
                {t(l, 'pagination.prev')}
              </Link>
            ) : (
              <span />
            )}
            <span className="text-text-muted text-sm">
              {t(l, 'pagination.page')} {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={pagePath(l, page + 1)} rel="next" className={linkCls}>
                {t(l, 'pagination.next')}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>
    </>
  )
}
