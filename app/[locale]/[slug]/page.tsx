import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { type Locale, locales, formatDate } from '@/lib/i18n'
import { getPost, getAllPostSlugs } from '@/sanity/queries'
import { urlFor, getImageUrl } from '@/sanity/image'
import { PortableText } from '@/sanity/portableText'
import { articleSchema } from '@/lib/schema'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedArticles from '@/components/blog/RelatedArticles'
import ShareButtons from '@/components/blog/ShareButtons'
import AuthorBox from '@/components/blog/AuthorBox'
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
      <main className="min-h-screen bg-surface-base pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* â”€â”€ Breadcrumb â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <nav aria-label={isAr ? 'Ù…Ø³Ø§Ø± Ø§Ù„ØªÙ†Ù‚Ù„' : 'Breadcrumb'} className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <li>
                <Link href={`/${l}`} className="hover:text-purple-primary transition-colors">
                  {isAr ? 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©' : 'Home'}
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
          
          {/* â”€â”€ Article Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <header className="mb-10 max-w-4xl mx-auto text-center md:text-start xl:mx-0 xl:ms-[calc(220px+2.5rem)]">
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
                <time dateTime={post.publishedAt} itemProp="datePublished">
                  {formatDate(post.publishedAt, l)}
                </time>
                {post.readTime && (
                  <>
                    <span className="opacity-50" aria-hidden="true">â€¢</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </span>
            </div>

            <h1 itemProp="headline" className="font-arabic-heading font-bold text-3xl md:text-5xl text-text-primary leading-[1.3] mb-6">
              {post.title}
            </h1>
            
            <p itemProp="description" className="font-body text-text-muted text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 pb-8 border-b border-surface-border">
              {post.author && (
                <address className="not-italic" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <Link href={`/${l}/authors/${post.author.slug.current}`} rel="author" className="flex items-center gap-3 group">
                    {post.author.avatar?.asset ? (
                      <Image
                        src={urlFor(post.author.avatar).width(56).height(56).format('webp').url()}
                        alt={authorName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border border-surface-border group-hover:border-purple-primary transition-colors"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-primary/10 flex items-center justify-center text-lg text-purple-primary font-bold">
                        {authorName.charAt(0)}
                      </div>
                    )}
                    <div className="text-start">
                      <p itemProp="name" className="font-bold text-text-primary text-sm group-hover:text-purple-primary transition-colors">
                        {authorName}
                      </p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {isAr ? post.author.jobTitleAr ?? post.author.jobTitle : post.author.jobTitle}
                      </p>
                    </div>
                  </Link>
                </address>
              )}
            </div>
          </header>

          {/* â”€â”€ Affiliate Disclosure â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {post.affiliateDisclosure && (
            <aside
              aria-label={isAr ? 'ØªÙ†ÙˆÙŠÙ‡ Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„ØªØ§Ø¨Ø¹Ø©' : 'Affiliate disclosure'}
              className="max-w-4xl mx-auto xl:mx-0 xl:ms-[calc(220px+2.5rem)] bg-surface-card border border-surface-border rounded-lg p-4 mb-10 text-sm text-text-muted text-center italic"
            >
              {isAr
                ? 'ØªÙ†ÙˆÙŠÙ‡: ÙŠØ­ØªÙˆÙŠ Ù‡Ø°Ø§ Ø§Ù„Ù…Ù‚Ø§Ù„ Ø¹Ù„Ù‰ Ø±ÙˆØ§Ø¨Ø· ØªØ§Ø¨Ø¹Ø©. Ù‚Ø¯ Ù†Ø±Ø¨Ø­ Ø¹Ù…ÙˆÙ„Ø© Ø¹Ù†Ø¯ Ø´Ø±Ø§Ø¦Ùƒ Ù…Ù† Ø®Ù„Ø§Ù„Ù‡Ø§ Ø¯ÙˆÙ† Ø£ÙŠ ØªÙƒÙ„ÙØ© Ø¥Ø¶Ø§ÙÙŠØ© Ø¹Ù„ÙŠÙƒ. Ø´ÙƒØ±Ø§Ù‹ Ù„Ø¯Ø¹Ù…Ùƒ!'
                : 'Disclosure: This article contains affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you. Thank you for your support!'}
            </aside>
          )}

          {/* â”€â”€ Main Image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {mainImageUrl && (
            <figure className="mb-12 max-w-4xl mx-auto xl:mx-0 xl:ms-[calc(220px+2.5rem)] rounded-2xl overflow-hidden border border-surface-border">
              <div className="relative aspect-video w-full bg-surface-raised">
                <Image
                  src={mainImageUrl}
                  alt={post.mainImage?.alt ?? post.title}
                  fill
                  priority
                  itemProp="image"
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          {/* â”€â”€ 3-Column Layout: TOC | Body | Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="grid grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_280px] gap-8 xl:gap-10">

            {/* LEFT â€” Table of contents (desktop) */}
            {post.body && (
              <aside aria-label={isAr ? 'Ù…Ø­ØªÙˆÙŠØ§Øª Ø§Ù„Ù…Ù‚Ø§Ù„' : 'Table of contents'} className="hidden xl:block">
                <div className="sticky top-28">
                  <TableOfContents body={post.body} variant="desktop" locale={l} />
                </div>
              </aside>
            )}

            {/* CENTER â€” Article body */}
            <div className="min-w-0 xl:col-start-2">
              {post.body && <TableOfContents body={post.body} variant="mobile" locale={l} />}

              <section itemProp="articleBody" className="article-body">
                {post.body ? (
                  <PortableText value={post.body} />
                ) : (
                  <div className="p-8 bg-surface-card rounded-xl text-center border border-surface-border">
                    <p className="text-text-muted">{isAr ? 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø­ØªÙˆÙ‰.' : 'No content available.'}</p>
                  </div>
                )}
              </section>

              {/* Footer: tags, share, author */}
              <footer className="mt-12">
                {post.keywords && post.keywords.length > 0 && (
                  <div className="pt-8 border-t border-surface-border">
                    <h2 className="text-text-primary font-bold mb-4 text-sm">
                      {isAr ? 'Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…ÙØªØ§Ø­ÙŠØ©:' : 'Tags:'}
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                      {post.keywords.map((keyword) => (
                        <li key={keyword} className="bg-surface-card border border-surface-border text-text-muted text-xs px-3 py-1.5 rounded-md">
                          {keyword}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ShareButtons title={post.title} slug={post.slug.current} locale={l} />
                <AuthorBox author={post.author} />
              </footer>
            </div>

            {/* RIGHT â€” Sidebar */}
            <aside aria-label={isAr ? 'Ø§Ù„Ø´Ø±ÙŠØ· Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠ' : 'Article sidebar'} className="xl:col-start-3 xl:row-start-1">
              <div className="xl:sticky xl:top-28 space-y-6">
                <section aria-label={isAr ? 'Ø¥Ø¹Ù„Ø§Ù†' : 'Advertisement'} className="ad-slot min-h-[250px] xl:min-h-[600px]">
                  AdSense Vertical / Sidebar Ad
                </section>
                <RelatedArticles posts={post.related} locale={l} />
              </div>
            </aside>

          </div>
        </article>
        </div>
      </main>
    </>
  )
}
