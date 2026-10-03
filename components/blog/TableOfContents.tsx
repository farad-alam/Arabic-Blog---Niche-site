'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

/** Tracks which heading is currently in the reading zone. */
function useActiveHeading(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return
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
  }, [items])

  return [activeId, setActiveId] as const
}

export default function TableOfContents({ body, variant = 'desktop', locale = 'en' }: TableOfContentsProps) {
  const items = useMemo(() => extractHeadings(body ?? []), [body])
  const [activeId, setActiveId] = useActiveHeading(items)
  const label = locale === 'ar' ? 'محتويات المقال' : 'On this page'

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
    <MobileToc
      items={items}
      activeId={activeId}
      setActiveId={setActiveId}
      locale={locale}
      label={label}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile: inline trigger row + floating button + bottom sheet
// ─────────────────────────────────────────────────────────────────────────────

function ListIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3.5" cy="6" r="1" />
      <circle cx="3.5" cy="12" r="1" />
      <circle cx="3.5" cy="18" r="1" />
    </svg>
  )
}

interface MobileTocProps {
  items: TocItem[]
  activeId: string
  setActiveId: (id: string) => void
  locale: 'ar' | 'en'
  label: string
}

function MobileToc({ items, activeId, setActiveId, locale, label }: MobileTocProps) {
  const isAr = locale === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const open = useCallback((e?: React.MouseEvent<HTMLElement>) => {
    triggerRef.current = (e?.currentTarget as HTMLElement) ?? null
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus?.()
  }, [])

  // Floating button appears once the reader is past the intro
  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sheet behaviour: scroll lock, Esc, focus trap, centre active item
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    panelRef.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: 'center' })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setActiveId(id)
    setIsOpen(false)
    // wait a tick so the scroll lock is released before scrolling
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
    }, 60)
  }

  const activeItem = items.find((i) => i.id === activeId)

  return (
    <div className="xl:hidden">
      {/* Inline trigger row (sits at the top of the article) */}
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="w-full mb-8 flex items-center gap-3 min-h-[52px] px-4 bg-surface-card border border-surface-border rounded-xl text-start shadow-sm-light active:bg-surface-hover transition-colors"
      >
        <span className="text-purple-primary shrink-0">
          <ListIcon />
        </span>
        <span className="flex-1 font-heading text-sm font-semibold text-text-primary">
          {label}
          <span className="ms-2 text-xs font-normal text-text-muted">({items.length})</span>
        </span>
        <svg className="text-text-muted shrink-0 rtl:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Floating button (thumb zone) */}
      {showFab && !isOpen && (
        <button
          type="button"
          onClick={open}
          aria-label={label}
          aria-haspopup="dialog"
          className="animate-fade-in fixed bottom-safe end-4 z-40 w-12 h-12 rounded-full bg-purple-primary text-white shadow-lg-light flex items-center justify-center active:scale-95 transition-transform"
        >
          <ListIcon />
        </button>
      )}

      {/* Bottom sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label={isAr ? 'إغلاق' : 'Close'}
            tabIndex={-1}
            onClick={close}
            className="animate-fade-in absolute inset-0 w-full h-full bg-black/40 cursor-default"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="animate-sheet-up absolute inset-x-0 bottom-0 max-h-[75vh] flex flex-col bg-surface-base rounded-t-2xl shadow-lg-light"
          >
            <div className="flex justify-center pt-2.5" aria-hidden="true">
              <span className="w-10 h-1 rounded-full bg-surface-border" />
            </div>
            <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-surface-border">
              <div className="min-w-0">
                <h2 className="font-arabic-heading font-bold text-text-primary text-base">{label}</h2>
                {activeItem && (
                  <p className="text-xs text-text-muted truncate mt-0.5">{activeItem.text}</p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="shrink-0 w-11 h-11 -me-2 flex items-center justify-center rounded-full text-text-muted active:bg-surface-hover"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav aria-label={label} className="overflow-y-auto overscroll-contain px-3 pt-2 pb-safe">
              <ol>
                {items.map((item) => {
                  const active = activeId === item.id
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => goTo(e, item.id)}
                        aria-current={active ? 'true' : undefined}
                        className={`flex items-center min-h-[48px] py-2.5 pe-3 rounded-lg border-s-[3px] text-[15px] leading-snug transition-colors ${
                          item.level === 'h3' ? 'ps-8 text-text-muted' : 'ps-4 font-medium text-text-primary'
                        } ${
                          active
                            ? 'border-purple-primary bg-purple-primary/10 !text-purple-primary font-semibold'
                            : 'border-transparent active:bg-surface-hover'
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
