import Link from 'next/link'
import Image from 'next/image'
import { type Locale, formatDateShort, t } from '@/lib/i18n'
import { getImageUrl } from '@/sanity/image'
import type { SanityPostCard } from '@/sanity/queries'
import SectionHeading from '@/components/ui/SectionHeading'

interface FeaturedPostsProps {
  locale: Locale
  posts: SanityPostCard[]
}

/** One large lead story + up to three compact stories. Hidden when there are no posts. */
export default function FeaturedPosts({ locale, posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) return null

  const isAr = locale === 'ar'
  const [lead, ...rest] = posts
  const side = rest.slice(0, 3)
  const leadImage = getImageUrl(lead.mainImage, { width: 1200, height: 675 })
  const leadCategory = isAr ? lead.category?.titleAr : lead.category?.titleEn

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <SectionHeading title={t(locale, 'home.trending')} eyebrow={t(locale, 'home.featured')} isRtl={isAr} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Lead story */}
        <Link
          href={`/${locale}/${lead.slug.current}`}
          className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card min-h-[320px] md:min-h-[440px] flex ${
            side.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'
          }`}
        >
          {leadImage ? (
            <Image
              src={leadImage}
              alt={lead.mainImage?.alt ?? lead.title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/40 via-surface-raised to-surface-base" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="relative mt-auto p-6 md:p-9 w-full">
            {leadCategory && (
              <span className="inline-block mb-4 text-xs font-semibold bg-brand-primary text-white px-3 py-1 rounded-full">
                {leadCategory}
              </span>
            )}
            <h3 className="font-arabic-heading font-bold text-2xl md:text-4xl text-white leading-snug mb-3 group-hover:text-brand-light transition-colors">
              {lead.title}
            </h3>
            {lead.excerpt && (
              <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-2xl">{lead.excerpt}</p>
            )}
            <div className="mt-4 text-xs text-white/60 flex items-center gap-3">
              <time dateTime={lead.publishedAt}>{formatDateShort(lead.publishedAt, locale)}</time>
              {lead.readTime && (
                <>
                  <span>•</span>
                  <span>{lead.readTime}</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Side stories */}
        {side.length > 0 && (
          <div className="lg:col-span-2 flex flex-col gap-4">
            {side.map((post) => {
              const img = getImageUrl(post.mainImage, { width: 320, height: 240 })
              const cat = isAr ? post.category?.titleAr : post.category?.titleEn
              return (
                <Link
                  key={post._id}
                  href={`/${locale}/${post.slug.current}`}
                  className="group flex gap-4 p-3 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-primary/40 hover:shadow-card transition-colors flex-1"
                >
                  <div className="relative w-28 sm:w-36 shrink-0 rounded-xl overflow-hidden bg-surface-raised min-h-[96px]">
                    {img ? (
                      <Image
                        src={img}
                        alt={post.mainImage?.alt ?? post.title}
                        fill
                        sizes="144px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-50">📝</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    {cat && <span className="text-[11px] font-semibold text-brand-primary mb-1.5">{cat}</span>}
                    <h4 className="font-arabic-heading font-bold text-text-primary text-base leading-snug line-clamp-2 group-hover:text-brand-light transition-colors">
                      {post.title}
                    </h4>
                    <span className="mt-2 text-xs text-text-muted">{formatDateShort(post.publishedAt, locale)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
