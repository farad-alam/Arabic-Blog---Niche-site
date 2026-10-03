import Link from 'next/link'
import Image from 'next/image'
import { urlFor, getImageUrl } from '@/sanity/image'
import type { SanityPostCard } from '@/sanity/queries'
import { type Locale, formatDateShort } from '@/lib/i18n'

interface PostCardProps {
  post: SanityPostCard
  locale: Locale
}

export default function PostCard({ post, locale }: PostCardProps) {
  const isAr = locale === 'ar'
  const categoryTitle = isAr ? post.category?.titleAr : post.category?.titleEn
  const authorName = isAr && post.author?.firstNameAr
    ? `${post.author.firstNameAr} ${post.author.lastNameAr ?? ''}`.trim()
    : `${post.author?.firstName ?? ''} ${post.author?.lastName ?? ''}`.trim()
  const imageUrl = getImageUrl(post.mainImage, { width: 600, height: 338 })

  return (
    <Link
      href={`/${locale}/${post.slug.current}`}
      className="group flex flex-col bg-surface-card rounded-xl overflow-hidden border border-surface-border hover:border-purple-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <div className="relative aspect-video bg-surface-raised overflow-hidden border-b border-surface-border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl opacity-30">
            📝
          </div>
        )}
        
        {/* Category Badge on Image */}
        {categoryTitle && (
          <div className="absolute top-3 right-3 rtl:right-3 ltr:left-3 rtl:left-auto">
            <span className="bg-white/90 backdrop-blur text-purple-primary text-xs font-body font-medium px-2.5 py-1 rounded-md border border-surface-border shadow-sm">
              {categoryTitle}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-arabic-heading font-bold text-text-primary text-lg leading-snug mb-2 group-hover:text-purple-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="font-body text-text-muted text-sm leading-[1.6] line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <div className="flex items-center gap-2">
            {post.author?.avatar?.asset ? (
              <Image
                src={urlFor(post.author.avatar).width(48).height(48).format('webp').url()}
                alt={authorName}
                width={24}
                height={24}
                className="rounded-full object-cover border border-surface-border"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-purple-primary/10 flex items-center justify-center text-[10px] text-purple-primary font-bold">
                {authorName.charAt(0)}
              </div>
            )}
            <span className="text-xs text-text-muted truncate max-w-[100px]">
              {authorName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {post.readTime && <span className="hidden sm:inline-block">{post.readTime}</span>}
            <span className="hidden sm:inline-block">•</span>
            <time dateTime={post.publishedAt}>
              {formatDateShort(post.publishedAt, locale)}
            </time>
          </div>
        </div>
      </div>
    </Link>
  )
}
