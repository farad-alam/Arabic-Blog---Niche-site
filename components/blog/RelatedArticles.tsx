import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/sanity/image'
import type { SanityPostCard } from '@/sanity/queries'
import { type Locale, formatDateShort } from '@/lib/i18n'

interface RelatedArticlesProps {
  posts?: SanityPostCard[]
  locale: Locale
  /**
   * sidebar — compact list for the desktop right column
   * rail    — swipeable large cards for phones / tablets (below the article)
   */
  variant?: 'sidebar' | 'rail'
  className?: string
}

export default function RelatedArticles({
  posts,
  locale,
  variant = 'sidebar',
  className = '',
}: RelatedArticlesProps) {
  if (!posts || posts.length === 0) return null
  const isAr = locale === 'ar'
  const heading = isAr ? 'اقرأ أيضاً' : 'Read Also'
  const headingId = `related-articles-heading-${variant}`

  if (variant === 'rail') {
    return (
      <section aria-labelledby={headingId} className={`defer-render ${className}`}>
        <h2
          id={headingId}
          className="font-arabic-heading font-bold text-text-primary text-xl mb-4"
        >
          {heading}
        </h2>
        <ul
          className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-px-4 pb-3 scrollbar-hide overscroll-x-contain"
        >
          {posts.map((p) => {
            const img = getImageUrl(p.mainImage, { width: 480, height: 300 })
            return (
              <li key={p._id} className="snap-start shrink-0 w-[74%] max-w-[300px] sm:w-[46%]">
                <Link
                  href={`/${locale}/${p.slug.current}`}
                  className="group block h-full bg-surface-card rounded-xl border border-surface-border overflow-hidden shadow-card active:scale-[0.99] transition-transform"
                >
                  <div className="relative aspect-[16/10] bg-surface-raised">
                    {img && (
                      <Image
                        src={img}
                        alt={p.mainImage?.alt ?? p.title}
                        fill
                        sizes="(max-width: 640px) 74vw, 300px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-arabic-heading text-[15px] font-bold text-text-primary leading-snug line-clamp-3 min-h-[3.9em] group-hover:text-purple-primary transition-colors">
                      {p.title}
                    </h3>
                    <time dateTime={p.publishedAt} className="text-xs text-text-muted mt-2 block">
                      {formatDateShort(p.publishedAt, locale)}
                    </time>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-surface-card rounded-xl border border-surface-border p-5 ${className}`}
    >
      <h2
        id={headingId}
        className="font-arabic-heading font-bold text-text-primary text-lg mb-4 border-b border-surface-border pb-3"
      >
        {heading}
      </h2>
      <ul className="space-y-4">
        {posts.map((p) => {
          const img = getImageUrl(p.mainImage, { width: 160, height: 120 })
          return (
            <li key={p._id}>
              <Link href={`/${locale}/${p.slug.current}`} className="group flex gap-3 items-start">
                <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-surface-raised border border-surface-border">
                  {img && (
                    <Image
                      src={img}
                      alt={p.mainImage?.alt ?? p.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-body text-sm font-semibold text-text-primary leading-snug line-clamp-3 group-hover:text-purple-primary transition-colors">
                    {p.title}
                  </h3>
                  <time dateTime={p.publishedAt} className="text-xs text-text-muted mt-1 block">
                    {formatDateShort(p.publishedAt, locale)}
                  </time>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
