'use client'

import { useEffect, useMemo, useState } from 'react'
import { SanityBlock } from '@/sanity/queries'

interface TocItem {
  id: string
  text: string
  level: 'h2' | 'h3'
}

// Must stay identical to slugify() in sanity/portableText.tsx so anchors match
function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-z0-9-]/gi, '')
    .toLowerCase()
}

function extractHeadings(body: SanityBlock[]): TocItem[] {
  return body
    .filter((b) => b._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map((b) => {
      const children = (b.children as { text?: string }[] | undefined) ?? []
      const text = children.map((c) => c?.text ?? '').join('')
      return { id: slugify(text), text, level: b.style as 'h2' | 'h3' }
    })
    .filter((item) => item.text.length > 0 && item.id.length > 0)
}

interface TableOfContentsProps {
  body: SanityBlock[]
  variant?: 'desktop' | 'mobile'
  locale?: 'ar' | 'en'
}

export default function TableOfContents({ body, variant = 'desktop', locale = 'en' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const items = useMemo(() => extractHeadings(body ?? []), [body])
  const label = locale === 'ar' ? 'محتويات المقال' : 'On this page'

  // Highlight the currently visible heading (desktop only needs it)
  useEffect(() => {
    if (items.length === 0 || variant !== 'desktop') return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items, variant])

  if (items.length < 2) return null

  if (variant === 'desktop') {
    return (
      <nav aria-label={label} className="max-h-[calc(100vh-8rem)] overflow-y-auto pe-2">
        <p className="font-heading text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">
          {label}
        </p>
        <ol className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
                className={`block font-body text-sm leading-snug py-1.5 border-s-2 transition-all duration-150 ${
                  item.level === 'h3' ? 'ps-6' : 'ps-3'
                } ${
                  activeId === item.id
                    ? 'border-purple-primary text-purple-primary font-medium'
                    : 'border-surface-border text-text-muted hover:text-text-primary hover:border-purple-primary/40'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  return (
    <div className="xl:hidden mb-8 bg-surface-card border border-surface-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 font-heading text-sm font-semibold text-text-primary"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-nav"
      >
        <span>{label}</span>
        <span
          className={`text-purple-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <div
        id="mobile-toc-nav"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav aria-label={label} className="px-5 pb-4 border-t border-surface-border">
          <ol className="mt-3 space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center font-body text-sm text-text-muted hover:text-purple-primary transition-colors py-2.5 border-s-2 border-surface-border ${
                    item.level === 'h3' ? 'ps-5' : 'ps-3'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
