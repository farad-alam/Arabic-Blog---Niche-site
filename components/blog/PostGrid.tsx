import type { SanityPostCard } from '@/sanity/queries'
import { type Locale, t } from '@/lib/i18n'
import SectionHeading from '@/components/ui/SectionHeading'
import PostCard from './PostCard'

interface PostGridProps {
  posts: SanityPostCard[]
  locale: Locale
  title?: string
  /** Adds a "View all" link next to the title */
  viewAllHref?: string
  /** Render nothing (instead of the empty state) when there are no posts */
  hideWhenEmpty?: boolean
}

export default function PostGrid({ posts, locale, title, viewAllHref, hideWhenEmpty }: PostGridProps) {
  if (!posts || posts.length === 0) {
    if (hideWhenEmpty) return null
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20 bg-surface-card rounded-2xl border border-surface-border">
          <div className="text-4xl mb-4 opacity-40">📭</div>
          <h3 className="font-arabic-heading text-xl text-text-primary mb-2">
            {t(locale, 'noContent.title')}
          </h3>
          <p className="text-text-muted font-body">
            {t(locale, 'noContent.description')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <section id="latest" className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={title || (locale === 'ar' ? 'أحدث المقالات' : 'Latest Articles')}
          href={viewAllHref}
          linkLabel={viewAllHref ? t(locale, 'common.viewAll') : undefined}
          isRtl={locale === 'ar'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
