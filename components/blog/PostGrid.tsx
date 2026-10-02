import type { SanityPostCard } from '@/sanity/queries'
import { type Locale, t } from '@/lib/i18n'
import PostCard from './PostCard'

interface PostGridProps {
  posts: SanityPostCard[]
  locale: Locale
  title?: string
}

export default function PostGrid({ posts, locale, title }: PostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 bg-dark-card rounded-2xl border border-dark-border">
        <div className="text-4xl mb-4 opacity-50">📭</div>
        <h3 className="font-arabic-heading text-xl text-text-primary mb-2">
          {t(locale, 'noContent.title')}
        </h3>
        <p className="text-text-muted font-body">
          {t(locale, 'noContent.description')}
        </p>
      </div>
    )
  }

  return (
    <section id="latest" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-arabic-heading font-bold text-3xl md:text-4xl text-text-primary">
            {title || (locale === 'ar' ? 'أحدث المقالات' : 'Latest Articles')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
