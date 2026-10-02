import Image from 'next/image'
import Link from 'next/link'
import type { SanityAuthor } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

interface AuthorBoxProps {
  author?: SanityAuthor | null
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  // Fallback when no author is assigned yet
  if (!author) {
    return (
      <div className="flex items-start gap-4 bg-dark-card border border-dark-border rounded-xl p-5 mb-10">
        <div className="shrink-0 w-12 h-12 rounded-full bg-purple-primary/10 border border-purple-primary/20 flex items-center justify-center text-xl font-heading font-bold text-purple-primary select-none">
          MB
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-text-primary text-sm leading-tight mb-0.5">
            MotionBite Team
          </p>
          <p className="font-body text-text-muted text-xs leading-relaxed mb-2">
            Web design &amp; development agency helping businesses get found online. We build fast,
            professional websites — delivered in 14 days.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="https://www.linkedin.com/company/motionbiteit/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-purple-primary hover:underline transition-colors"
            >
              LinkedIn
            </Link>
            <span className="text-dark-border" aria-hidden="true">·</span>
            <Link
              href="https://x.com/motionbiteit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-purple-primary hover:underline transition-colors"
            >
              X / Twitter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const fullName = `${author.firstName} ${author.lastName}`.trim()
  const avatarUrl = author.avatar?.asset
    ? urlFor(author.avatar).width(96).height(96).format('webp').url()
    : null

  const socials = [
    { label: 'LinkedIn', href: author.linkedin },
    { label: 'X / Twitter', href: author.twitter },
    { label: 'Website', href: author.website },
    { label: 'Facebook', href: author.facebook },
  ].filter((s) => s.href)

  const initials = `${author.firstName?.[0] ?? ''}${author.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 sm:p-6 mb-10">
      {/* Stack on mobile (flex-col), side-by-side on sm+ (flex-row) */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">

        {/* Avatar + name on mobile (horizontal mini-row) */}
        <div className="flex sm:block items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={author.avatar?.alt ?? fullName}
              width={56}
              height={56}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-dark-border shrink-0"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-primary/10 border border-purple-primary/20 flex items-center justify-center text-lg font-heading font-bold text-purple-primary select-none shrink-0">
              {initials || 'MB'}
            </div>
          )}

          {/* On mobile: name + title appear next to avatar */}
          <div className="sm:hidden min-w-0">
            <p className="font-heading font-semibold text-text-primary text-sm leading-tight">
              {fullName}
            </p>
            {author.jobTitle && (
              <p className="font-body text-purple-primary text-xs">{author.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Info block */}
        <div className="flex-1 min-w-0">
          {/* Name + title: hidden on mobile (shown beside avatar above), shown on sm+ */}
          <div className="hidden sm:block mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-heading font-semibold text-text-primary text-sm leading-tight">
                {fullName}
              </p>
              {author.yearsExperience && (
                <span className="font-body text-xs text-text-muted">
                  · {author.yearsExperience}+ yrs experience
                </span>
              )}
            </div>
            {author.jobTitle && (
              <p className="font-body text-purple-primary text-xs mt-0.5">{author.jobTitle}</p>
            )}
          </div>

          {/* Years experience on mobile (below avatar row) */}
          {author.yearsExperience && (
            <p className="sm:hidden font-body text-xs text-text-muted mb-2">
              {author.yearsExperience}+ yrs experience
            </p>
          )}

          {author.shortBio && (
            <p className="font-body text-text-muted text-xs leading-relaxed mb-3 mt-0.5 sm:mt-0">
              {author.shortBio}
            </p>
          )}

          {/* Expertise tags */}
          {author.expertiseAreas && author.expertiseAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {author.expertiseAreas.map((area) => (
                <span
                  key={area}
                  className="font-body text-[10px] px-2 py-0.5 rounded-full bg-purple-primary/10 border border-purple-primary/20 text-purple-primary"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Social links + author page — flex-wrap to prevent overflow */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {socials.map((s, i) => (
              <span key={s.label} className="flex items-center gap-3">
                {i > 0 && <span className="text-dark-border" aria-hidden="true">·</span>}
                <Link
                  href={s.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-purple-primary hover:underline transition-colors"
                >
                  {s.label}
                </Link>
              </span>
            ))}
            {socials.length > 0 && <span className="text-dark-border" aria-hidden="true">·</span>}
            <Link
              href={`/authors/${author.slug.current}`}
              className="font-body text-xs text-purple-primary hover:underline transition-colors"
            >
              View all posts →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
