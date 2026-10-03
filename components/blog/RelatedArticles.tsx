import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/sanity/image'
import type { SanityPostCard } from '@/sanity/queries'
import { type Locale, formatDateShort } from '@/lib/i18n'

interface RelatedArticlesProps {
  posts?: SanityPostCard[]
  locale: Locale
}

export default function RelatedArticles({ posts, locale }: RelatedArticlesProps) {
  if (!posts || posts.length === 0) return null
  const isAr = locale === 'ar'
  const heading = isAr ? 'اقرأ أيضاً' : 'Read Also'

  return (
    <section aria-labelledby="related-articles-heading" className="bg-surface-card rounded-xl border border-surface-border p-5">
      <h2
        id="related-articles-heading"
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
