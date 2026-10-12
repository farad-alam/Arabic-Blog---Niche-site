import Link from 'next/link'
import Image from 'next/image'
import { type Locale, formatDateShort } from '@/lib/i18n'
import { getImageUrl } from '@/sanity/image'
import type { CategoryWithPosts } from '@/sanity/queries'

interface CategoryShelvesProps {
  locale: Locale
  categories: CategoryWithPosts[]
}

export default function CategoryShelves({ locale, categories }: CategoryShelvesProps) {
  const isAr = locale === 'ar'

  // Filter only categories that have at least 1 published post
  const activeCategories = categories.filter((c) => c.posts && c.posts.length > 0)
  if (activeCategories.length === 0) return null

  return (
    <div className="space-y-14 md:space-y-20 py-8 md:py-12">
      {activeCategories.map((cat, idx) => {
        const catTitle = isAr ? cat.titleAr : cat.titleEn
        const catDesc = isAr ? cat.descriptionAr : cat.descriptionEn
        const catSlug = isAr ? cat.slugAr.current : cat.slugEn.current
        const catHref = `/${locale}/category/${catSlug}`

        return (
          <section
            key={cat._id}
            aria-labelledby={`cat-heading-${cat._id}`}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* ── Category Header & View All Link ──────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-surface-border">
              <div className="flex items-start sm:items-center gap-3.5">
                {cat.icon && (
                  <span
                    className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-2xl shrink-0 shadow-sm"
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </span>
                )}
                <div>
                  <h2
                    id={`cat-heading-${cat._id}`}
                    className="font-arabic-heading font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight"
                  >
                    {catTitle}
                  </h2>
                  {catDesc && (
                    <p className="text-sm text-text-muted mt-1 max-w-2xl line-clamp-1">
                      {catDesc}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={catHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors self-start sm:self-auto group shrink-0"
              >
                <span>{isAr ? `عرض جميع مقالات ${catTitle}` : `View all in ${catTitle}`}</span>
                <span className="inline-block transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true">
                  {isAr ? '←' : '→'}
                </span>
              </Link>
            </div>

            {/* ── Articles Grid (Top 4 in this category silo) ─────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {cat.posts.map((post) => {
                const imgUrl = getImageUrl(post.mainImage, { width: 600, height: 400 })
                const postHref = `/${locale}/${post.slug.current}`
                const formattedDate = formatDateShort(post.publishedAt, locale)

                return (
                  <article
                    key={post._id}
                    className="group flex flex-col bg-surface-card rounded-2xl border border-surface-border overflow-hidden hover:shadow-card-hover hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <Link href={postHref} className="relative aspect-[16/10] bg-surface-raised overflow-hidden block">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={post.mainImage?.alt ?? post.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                          {catTitle}
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      {/* Meta: Date & Read Time */}
                      <div className="flex items-center gap-2 text-xs text-text-muted mb-2 font-body">
                        <time dateTime={post.publishedAt}>{formattedDate}</time>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </>
                        )}
                      </div>

                      {/* Post Title */}
                      <h3 className="font-arabic-heading font-bold text-base sm:text-lg text-text-primary leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">
                        <Link href={postHref}>{post.title}</Link>
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-text-muted line-clamp-2 leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Read More Link */}
                      <div className="mt-auto pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-semibold text-brand-primary">
                        <span>{isAr ? 'اقرأ الدليل' : 'Read Guide'}</span>
                        <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true">
                          {isAr ? '←' : '→'}
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
