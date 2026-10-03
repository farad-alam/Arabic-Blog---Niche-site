'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { type Locale, t } from '@/lib/i18n'
import type { SanityCategory } from '@/sanity/queries'
import LanguageSwitcher from './LanguageSwitcher'

interface NavbarProps {
  locale: Locale
  categories: SanityCategory[]
  siteName: string
}

/** How many categories are shown inline on desktop before overflowing into "More" */
const INLINE_CATEGORIES = 5

export default function Navbar({ locale, categories, siteName }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAr = locale === 'ar'

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  const catHref = (cat: SanityCategory) =>
    `/${locale}/category/${isAr ? cat.slugAr.current : cat.slugEn.current}`
  const catTitle = (cat: SanityCategory) => (isAr ? cat.titleAr : cat.titleEn)

  const inline = categories.slice(0, INLINE_CATEGORIES)
  const overflow = categories.slice(INLINE_CATEGORIES)

  // Close everything whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setMoreOpen(false)
  }, [pathname])

  // Elevate the header slightly after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Focus the search input when the overlay opens; Escape closes overlays
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
        setMoreOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    if (!moreOpen) return
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [moreOpen])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearchOpen(false)
    setMenuOpen(false)
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`)
  }

  const linkClass =
    'text-sm font-body font-medium text-text-muted hover:text-[#1C1917] transition-colors whitespace-nowrap'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-xl border-surface-border shadow-sm-light'
          : 'bg-[#FAF8F5]/80 backdrop-blur-md border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* ── Logo ───────────────────────────────────────────────────── */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group shrink-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-primary/30 group-hover:scale-105 transition-transform">
              {siteName.charAt(0)}
            </span>
            <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-text-primary group-hover:text-brand-light transition-colors">
              {siteName}
            </span>
          </Link>

          {/* ── Desktop navigation ─────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center" aria-label="Main">
            {inline.map((cat) => (
              <Link key={cat._id} href={catHref(cat)} className={linkClass}>
                {catTitle(cat)}
              </Link>
            ))}

            {overflow.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  {t(locale, 'nav.more')}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {moreOpen && (
                  <div className="absolute top-full mt-3 start-0 min-w-[200px] rounded-xl border border-surface-border bg-surface-card shadow-lg-light p-2">
                    {overflow.map((cat) => (
                      <Link
                        key={cat._id}
                        href={catHref(cat)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                      >
                        {cat.icon && <span>{cat.icon}</span>}
                        {catTitle(cat)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link href={`/${locale}/articles`} className={linkClass}>
              {t(locale, 'nav.articles')}
            </Link>
          </nav>

          {/* ── Actions ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label={t(locale, 'nav.search')}
            >
              <Search size={20} />
            </button>
            <LanguageSwitcher currentLocale={locale} />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-[#FAF8F5]/98 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4 py-6 space-y-1" aria-label="Mobile">
            <Link
              href={`/${locale}`}
              className="block px-3 py-3 rounded-lg text-text-primary font-medium hover:bg-surface-hover"
            >
              {t(locale, 'site.home')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={catHref(cat)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-primary hover:bg-surface-hover"
              >
                {cat.icon && <span className="text-lg">{cat.icon}</span>}
                {catTitle(cat)}
              </Link>
            ))}
            <Link
              href={`/${locale}/articles`}
              className="block px-3 py-3 rounded-lg text-text-primary hover:bg-surface-hover"
            >
              {t(locale, 'nav.articles')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="block px-3 py-3 rounded-lg text-text-primary hover:bg-surface-hover"
            >
              {t(locale, 'nav.about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="block px-3 py-3 rounded-lg text-text-primary hover:bg-surface-hover"
            >
              {t(locale, 'nav.contact')}
            </Link>
          </nav>
        </div>
      )}

      {/* ── Search overlay ─────────────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[#1C1917]/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, 'nav.search')}
        >
          <form
            onSubmit={submitSearch}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center gap-3 bg-surface-card border border-brand-primary/40 rounded-2xl px-5 py-4 shadow-lg-light">
              <Search size={22} className="text-brand-primary shrink-0" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder={t(locale, 'search.placeholder')}
                className="flex-1 bg-transparent outline-none text-lg text-text-primary placeholder:text-text-muted caret-brand-primary"
                aria-label={t(locale, 'nav.search')}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-text-muted hover:text-text-primary"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-text-muted">
              {isAr ? 'اضغط Enter للبحث · Esc للإغلاق' : 'Press Enter to search · Esc to close'}
            </p>
          </form>
        </div>
      )}
    </header>
  )
}
