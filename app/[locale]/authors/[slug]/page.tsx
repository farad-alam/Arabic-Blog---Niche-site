import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import { getAllAuthorSlugs, getAuthor } from '@/sanity/queries'
import { personSchema } from '@/lib/schema'
import { urlFor } from '@/sanity/image'

// ISR: webhook fires revalidateTag('authors') to bust this
export const revalidate = 0

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) return {}
  const author = await getAuthor(slug, locale as Locale)
  if (!author) return {}

  const name = locale === 'ar' && author.firstNameAr
    ? `${author.firstNameAr} ${author.lastNameAr ?? ''}`.trim()
    : `${author.firstName} ${author.lastName}`.trim()

  return {
    title: name,
    description: locale === 'ar' ? author.shortBioAr : author.shortBio,
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const l = locale as Locale
  const author = await getAuthor(slug, l)
  if (!author) notFound()

  const name = l === 'ar' && author.firstNameAr
    ? `${author.firstNameAr} ${author.lastNameAr ?? ''}`.trim()
    : `${author.firstName} ${author.lastName}`.trim()

  const avatarUrl = author.avatar?.asset
    ? urlFor(author.avatar as any).width(200).height(200).format('webp').url()
    : undefined

  const personJsonLd = personSchema({
    firstName: author.firstName,
    lastName: author.lastName,
    slug,
    language: l,
    jobTitle: l === 'ar' ? author.jobTitleAr : author.jobTitle,
    shortBio: l === 'ar' ? author.shortBioAr : author.shortBio,
    expertiseAreas: author.expertiseAreas,
    linkedin: author.linkedin,
    twitter: author.twitter,
    website: author.website,
    avatarUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* Phase 2 will build the full author profile page UI */}
      <main className="min-h-screen bg-surface-base pt-12 pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col md:flex-row items-center gap-6 mb-12 text-center md:text-start">
            {avatarUrl && (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-surface-card shadow-sm">
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="font-arabic-heading font-bold text-3xl md:text-5xl text-text-primary mb-2">
                {name}
              </h1>
              <p className="text-primary font-medium text-lg mb-4">
                {l === 'ar' ? author.jobTitleAr ?? author.jobTitle : author.jobTitle}
              </p>
              <p className="text-text-muted leading-relaxed max-w-2xl">
                {l === 'ar' ? author.shortBioAr : author.shortBio}
              </p>
            </div>
          </header>
          
          <section aria-label={l === 'ar' ? 'مقالات الكاتب' : 'Author Articles'} className="border-t border-surface-border pt-12">
            <h2 className="font-arabic-heading font-bold text-2xl md:text-3xl text-text-primary mb-8">
              {l === 'ar' ? 'أحدث المقالات من' : 'Latest Articles by'} {name}
            </h2>
            <ul className="space-y-6">
              {author.posts.map((post) => (
                <li key={post._id} className="bg-surface-card p-6 rounded-2xl shadow-sm border border-surface-border">
                  <a href={`/${l}/${post.slug.current}`} className="text-xl font-arabic-heading font-bold text-text-primary hover:text-primary transition-colors">
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </>
  )
}
