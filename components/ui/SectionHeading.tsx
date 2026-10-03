import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface SectionHeadingProps {
  title: string
  eyebrow?: string
  /** Optional "view all" link */
  href?: string
  linkLabel?: string
  isRtl?: boolean
}

/** Consistent section title used across home / listing pages */
export default function SectionHeading({ title, eyebrow, href, linkLabel, isRtl }: SectionHeadingProps) {
  const Arrow = isRtl ? ArrowLeft : ArrowRight
  return (
    <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
      <div>
        {eyebrow && (
          <span className="block text-xs font-semibold uppercase tracking-widest text-purple-primary mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="font-arabic-heading font-bold text-2xl md:text-3xl text-text-primary">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-purple-primary transition-colors shrink-0"
        >
          {linkLabel}
          <Arrow size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
