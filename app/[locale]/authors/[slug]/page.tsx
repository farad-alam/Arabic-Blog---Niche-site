import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'
import { getAllAuthorSlugs, getAuthor } from '@/sanity/queries'
import { personSchema } from '@/lib/schema'
import { urlFor } from '@/sanity/image'

export const revalidate = false

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
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
        <h1>{name}</h1>
        <p style={{ color: '#888' }}>
          {l === 'ar' ? author.jobTitleAr ?? author.jobTitle : author.jobTitle}
        </p>
        <p>{l === 'ar' ? author.shortBioAr : author.shortBio}</p>
        <h2 style={{ marginTop: '2rem' }}>
          {l === 'ar' ? 'مقالات' : 'Articles'} ({author.posts.length})
        </h2>
        <ul>
          {author.posts.map((post) => (
            <li key={post._id}>
              <a href={`/${l}/${post.slug.current}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
