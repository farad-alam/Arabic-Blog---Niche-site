import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { type Locale, locales, formatDate } from '@/lib/i18n'
import { getPost, getAllPostSlugs } from '@/sanity/queries'
import { urlFor, getImageUrl } from '@/sanity/image'
import { PortableText } from '@/sanity/portableText'
import { articleSchema } from '@/lib/schema'
import type { Metadata } from 'next'

// ISR: serve stale while re-fetching in background; webhook can bust cache instantly via revalidateTag
export const revalidate = 0

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    const slugs = await getAllPostSlugs(locale)
    slugs.forEach((slug) => params.push({ locale, slug }))
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) return {}
  
  const post = await getPost(slug, locale as Locale)
  if (!post) return {}

  const isAr = locale === 'ar'
  const title = post.title
  const description = post.excerpt

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: post.translation ? {
        [isAr ? 'en' : 'ar']: `/${isAr ? 'en' : 'ar'}/${post.translation.slug.current}`
      } : undefined
    }
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale
  const post = await getPost(slug, l)
  if (!post) notFound()

  const isAr = l === 'ar'
  const mainImageUrl = getImageUrl(post.mainImage, { width: 1200, height: 675 })
  
  const categoryTitle = isAr ? post.category?.titleAr : post.category?.titleEn
  const categorySlug = isAr ? post.category?.slugAr?.current : post.category?.slugEn?.current

  const authorName = isAr && post.author?.firstNameAr
    ? `${post.author.firstNameAr} ${post.author.lastNameAr ?? ''}`.trim()
    : `${post.author?.firstName ?? ''} ${post.author?.lastName ?? ''}`.trim()

  const jsonLd = articleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug.current,
    language: l,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    keywords: post.keywords,
    imageUrl: getImageUrl(post.mainImage, { width: 1200, height: 630 }),
    wordCount: post.wordCount,
    author: post.author ? {
      firstName: post.author.firstName,
      lastName: post.author.lastName,
      slug: post.author.slug,
      jobTitle: post.author.jobTitle,
    } : undefined,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-dark-base pt-12 pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ── Article Header ────────────────────────────────────────────── */}
          <header className="mb-10 text-center md:text-start">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              {categoryTitle && categorySlug && (
                <Link
                  href={`/${l}/category/${categorySlug}`}
                  className="bg-purple-primary/10 text-purple-primary border border-purple-primary/20 text-xs font-body px-3 py-1.5 rounded-full hover:bg-purple-primary hover:text-white transition-colors"
                >
                  {categoryTitle}
                </Link>
              )}
              <span className="text-text-muted text-sm flex items-center gap-2">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt, l)}
                </time>
                {post.readTime && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="font-arabic-heading font-bold text-3xl md:text-5xl text-text-primary leading-[1.3] mb-6">
              {post.title}
            </h1>
            
            <p className="font-body text-text-muted text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 pb-10 border-b border-dark-border">
              {post.author && (
                <Link href={`/${l}/authors/${post.author.slug.current}`} className="flex items-center gap-3 group">
                  {post.author.avatar?.asset ? (
                    <Image
                      src={urlFor(post.author.avatar).width(56).height(56).format('webp').url()}
                      alt={authorName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border border-dark-border group-hover:border-purple-primary transition-colors"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-primary/10 flex items-center justify-center text-lg text-purple-primary font-bold">
                      {authorName.charAt(0)}
                    </div>
                  )}
                  <div className="text-start">
                    <p className="font-bold text-text-primary text-sm group-hover:text-purple-primary transition-colors">
                      {authorName}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {isAr ? post.author.jobTitleAr ?? post.author.jobTitle : post.author.jobTitle}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </header>

          {/* ── Affiliate Disclosure ──────────────────────────────────────── */}
          {post.affiliateDisclosure && (
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-10 text-sm text-text-muted text-center italic">
              {isAr
                ? 'تنويه: يحتوي هذا المقال على روابط تابعة. قد نربح عمولة عند شرائك من خلالها دون أي تكلفة إضافية عليك. شكراً لدعمك!'
                : 'Disclosure: This article contains affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you. Thank you for your support!'}
            </div>
          )}

          {/* ── Main Image ────────────────────────────────────────────────── */}
          {mainImageUrl && (
            <figure className="mb-12 rounded-2xl overflow-hidden border border-dark-border">
              <div className="relative aspect-video w-full bg-dark-card">
                <Image
                  src={mainImageUrl}
                  alt={post.mainImage?.alt ?? post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          {/* ── Content & Sidebar Layout ──────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Article Body */}
            <div className="flex-1 min-w-0 article-body">
              {post.body ? (
                <PortableText value={post.body} />
              ) : (
                <div className="p-8 bg-dark-card rounded-xl text-center border border-dark-border">
                  <p className="text-text-muted">No content available.</p>
                </div>
              )}

              {/* Tags/Keywords */}
              {post.keywords && post.keywords.length > 0 && (
                <div className="mt-12 pt-8 border-t border-dark-border">
                  <h4 className="text-text-primary font-bold mb-4 text-sm">
                    {isAr ? 'الكلمات المفتاحية:' : 'Tags:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.map(keyword => (
                      <span key={keyword} className="bg-dark-card border border-dark-border text-text-muted text-xs px-3 py-1.5 rounded-md">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (Desktop Sticky) */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* AdSlot Placeholder */}
                <div className="ad-slot min-h-[250px]">
                  AdSense Vertical / Sidebar Ad
                </div>

                {/* Popular Categories */}
                <div className="bg-dark-card rounded-xl border border-dark-border p-5">
                  <h3 className="font-arabic-heading font-bold text-text-primary text-lg mb-4 border-b border-dark-border pb-3">
                    {isAr ? 'اقرأ أيضاً' : 'Read Also'}
                  </h3>
                  {/* Phase 2 enhancement: fetch related articles and list them here */}
                  <p className="text-sm text-text-muted">
                    {isAr ? 'قريباً: مقالات ذات صلة' : 'Coming soon: related articles'}
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </article>
      </main>
    </>
  )
}
