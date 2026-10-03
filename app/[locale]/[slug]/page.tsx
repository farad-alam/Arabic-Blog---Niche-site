import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { type Locale, locales, formatDate } from '@/lib/i18n'
import { getPost, getAllPostSlugs, type SanityBlock } from '@/sanity/queries'
import { urlFor, getImageUrl } from '@/sanity/image'
import { PortableText } from '@/sanity/portableText'
import { articleSchema } from '@/lib/schema'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedArticles from '@/components/blog/RelatedArticles'
import ShareButtons from '@/components/blog/ShareButtons'
import AuthorBox from '@/components/blog/AuthorBox'
import ReadingProgress from '@/components/blog/ReadingProgress'
import AdSlot from '@/components/ads/AdSlot'
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

/**
 * Splits the article body once, after the intro (3rd plain paragraph), so a
 * mobile in-content ad can sit between the two halves. Rules:
 *  - only for articles with enough paragraphs (otherwise the ad dominates)
 *  - never splits in the middle of a list or right before a list item
 */
function splitBodyForAd(body: SanityBlock[]): [SanityBlock[], SanityBlock[]] {
  const MIN_PARAGRAPHS = 6
  const AFTER_PARAGRAPH = 3
  const isParagraph = (b: SanityBlock) =>
    b._type === 'block' && (b.style === 'normal' || !b.style) && !b.listItem

  const total = body.filter(isParagraph).length
  if (total < MIN_PARAGRAPHS) return [body, []]

  let count = 0
  for (let i = 0; i < body.length - 1; i++) {
    if (!isParagraph(body[i])) continue
    count++
    if (count >= AFTER_PARAGRAPH && !body[i + 1].listItem) {
      return [body.slice(0, i + 1), body.slice(i + 1)]
    }
  }
  return [body, []]
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

  const jobTitle = post.author
    ? (isAr ? post.author.jobTitleAr ?? post.author.jobTitle : post.author.jobTitle)
    : undefined

  const [bodyIntro, bodyRest] = post.body ? splitBodyForAd(post.body) : [[], []]

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
      <ReadingProgress targetId="article-content" />
      <main className="min-h-screen bg-surface-base pt-4 md:pt-8 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Breadcrumb ────────────────────────────────────────────────── */}
          <nav aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'} className="mb-4 md:mb-8">
            {/* Phones: a single, thumb-friendly "back" link */}
            <Link
              href={categoryTitle && categorySlug ? `/${l}/category/${categorySlug}` : `/${l}`}
              className="md:hidden inline-flex items-center gap-1 min-h-[44px] -ms-1 pe-3 text-sm font-medium text-text-muted active:text-purple-primary"
            >
              <svg className="rtl:rotate-180 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="truncate max-w-[70vw]">
                {categoryTitle && categorySlug ? categoryTitle : isAr ? 'الرئيسية' : 'Home'}
              </span>
            </Link>

            {/* md+: full trail */}
            <ol className="hidden md:flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <li>
                <Link href={`/${l}`} className="hover:text-purple-primary transition-colors">
                  {isAr ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              {categoryTitle && categorySlug && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/${l}/category/${categorySlug}`} className="hover:text-purple-primary transition-colors">
                      {categoryTitle}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-primary line-clamp-1 max-w-[60ch]">{post.title}</li>
            </ol>
          </nav>

          <article itemScope itemType="https://schema.org/Article">
            
            {/* ── 3-Column Layout: TOC | Content | Sidebar (xl) — single readable column below ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_280px] gap-6 xl:gap-10 max-w-[760px] mx-auto xl:max-w-none">

              {/* LEFT — Table of contents (desktop) */}
              {post.body && (
                <aside aria-label={isAr ? 'محتويات المقال' : 'Table of contents'} className="hidden xl:block">
                  <div className="sticky top-28">
                    <TableOfContents body={post.body} variant="desktop" locale={l} />
                  </div>
                </aside>
              )}

              {/* CENTER — Header, Image, Article body */}
              <div className="min-w-0 xl:col-start-2">
                
                {/* ── Article Header ────────────────────────────────────────────── */}
                <header className="mb-5 md:mb-8 text-start">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3 md:mb-5">
                    {categoryTitle && categorySlug && (
                      <Link
                        href={`/${l}/category/${categorySlug}`}
                        className="bg-purple-primary/10 text-purple-primary border border-purple-primary/20 text-xs font-semibold font-body px-3 py-1.5 rounded-full hover:bg-purple-primary hover:text-white transition-colors"
                      >
                        {categoryTitle}
                      </Link>
                    )}
                    <span className="text-text-muted text-[13px] md:text-sm flex items-center gap-2">
                      <time dateTime={post.publishedAt} itemProp="datePublished">
                        {formatDate(post.publishedAt, l)}
                      </time>
                      {post.readTime && (
                        <>
                          <span className="opacity-50" aria-hidden="true">•</span>
                          <span>{post.readTime}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h1 itemProp="headline" className="font-arabic-heading font-bold text-[26px] sm:text-4xl md:text-5xl text-text-primary leading-[1.4] md:leading-[1.3] text-balance mb-3 md:mb-5">
                    {post.title}
                  </h1>
                  
                  <p itemProp="description" className="font-body text-text-muted text-base md:text-xl leading-relaxed line-clamp-3 md:line-clamp-none mb-4 md:mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 pb-4 md:pb-6 border-b border-surface-border">
                    {post.author && (
                      <address className="not-italic min-w-0" itemProp="author" itemScope itemType="https://schema.org/Person">
                        <Link href={`/${l}/authors/${post.author.slug.current}`} rel="author" className="flex items-center gap-3 group min-h-[44px]">
                          {post.author.avatar?.asset ? (
                            <Image
                              src={urlFor(post.author.avatar).width(80).height(80).format('webp').url()}
                              alt={authorName}
                              width={40}
                              height={40}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-surface-border group-hover:border-purple-primary transition-colors shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-primary/10 flex items-center justify-center text-base text-purple-primary font-bold shrink-0">
                              {authorName.charAt(0)}
                            </div>
                          )}
                          <div className="text-start min-w-0">
                            <p itemProp="name" className="font-bold text-text-primary text-sm group-hover:text-purple-primary transition-colors truncate">
                              {authorName}
                            </p>
                            {jobTitle && (
                              <p className="text-text-muted text-xs mt-0.5 truncate">{jobTitle}</p>
                            )}
                          </div>
                        </Link>
                      </address>
                    )}
                  </div>
                </header>

                {/* ── Main Image (full-bleed on phones so it's the first visual) ─ */}
                {mainImageUrl && (
                  <figure className="-mx-4 sm:mx-0 mb-5 md:mb-8 sm:rounded-2xl overflow-hidden border-y sm:border border-surface-border">
                    <div className="relative aspect-[16/10] sm:aspect-video w-full bg-surface-raised">
                      <Image
                        src={mainImageUrl}
                        alt={post.mainImage?.alt ?? post.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 760px, 640px"
                        itemProp="image"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                )}

                {/* ── Affiliate Disclosure (compact) ───────────────────────────── */}
                {post.affiliateDisclosure && (
                  <aside
                    aria-label={isAr ? 'تنويه الروابط التابعة' : 'Affiliate disclosure'}
                    className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/80 rounded-lg px-3.5 py-3 mb-6 md:mb-8 text-[13px] leading-relaxed text-stone-700"
                  >
                    <svg className="shrink-0 mt-0.5 text-amber-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p className="text-start">
                      {isAr
                        ? 'تنويه: يحتوي هذا المقال على روابط تابعة. قد نربح عمولة عند شرائك من خلالها دون أي تكلفة إضافية عليك. شكراً لدعمك!'
                        : 'Disclosure: This article contains affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you. Thank you for your support!'}
                    </p>
                  </aside>
                )}

                {/* ── Mobile TOC (trigger row + floating button + bottom sheet) ── */}
                {post.body && <TableOfContents body={post.body} variant="mobile" locale={l} />}

                {/* ── Article body ────────────────────────────────────────────── */}
                <section id="article-content" itemProp="articleBody" className="article-body">
                  {post.body ? (
                    <>
                      <PortableText value={bodyIntro} />
                      {bodyRest.length > 0 && (
                        <>
                          {/* In-content ad: phones/tablets only (desktop uses the sidebar slot) */}
                          <AdSlot locale={l} size="rectangle" className="xl:hidden" />
                          <PortableText value={bodyRest} />
                        </>
                      )}
                    </>
                  ) : (
                    <div className="p-8 bg-surface-card rounded-xl text-center border border-surface-border">
                      <p className="text-text-muted">{isAr ? 'لا يوجد محتوى.' : 'No content available.'}</p>
                    </div>
                  )}
                </section>

                {/* End-of-article ad: phones/tablets only */}
                <AdSlot locale={l} size="rectangle" className="xl:hidden" />

                {/* Footer: tags, share, author */}
                <footer className="mt-8 md:mt-12">
                  {post.keywords && post.keywords.length > 0 && (
                    <div className="pt-6 md:pt-8 border-t border-surface-border">
                      <h2 className="text-text-primary font-bold mb-3 text-sm">
                        {isAr ? 'الكلمات المفتاحية:' : 'Tags:'}
                      </h2>
                      <ul className="flex flex-wrap gap-2">
                        {post.keywords.map((keyword) => (
                          <li key={keyword} className="bg-surface-card border border-surface-border text-text-muted text-[13px] px-3 py-1.5 rounded-lg">
                            {keyword}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ShareButtons title={post.title} slug={post.slug.current} locale={l} />
                  <AuthorBox author={post.author} />
                </footer>

                {/* Phones / tablets: swipeable "Read also" rail right after the author box */}
                <RelatedArticles posts={post.related} locale={l} variant="rail" className="xl:hidden mt-2" />
              </div>

              {/* RIGHT — Sidebar (desktop only; mobile gets in-content ads + the rail above) */}
              <aside aria-label={isAr ? 'الشريط الجانبي' : 'Article sidebar'} className="hidden xl:block xl:col-start-3 xl:row-start-1">
                <div className="xl:sticky xl:top-28 space-y-6">
                  <AdSlot locale={l} size="tall" className="!my-0" />
                  <RelatedArticles posts={post.related} locale={l} variant="sidebar" />
                </div>
              </aside>

            </div>
          </article>
        </div>
      </main>
    </>
  )
}
