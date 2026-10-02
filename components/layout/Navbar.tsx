'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import type { SanityCategory } from '@/sanity/queries'
import LanguageSwitcher from './LanguageSwitcher'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  locale: Locale
  categories: SanityCategory[]
  siteName: string
}

export default function Navbar({ locale, categories, siteName }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-dark-base/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-primary to-purple-gradient flex items-center justify-center text-white font-bold text-xl">
              {siteName.charAt(0)}
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-text-primary group-hover:text-purple-light transition-colors">
              {siteName}
            </span>
          </Link>

          {/* ── Desktop Navigation ─────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/${locale}/category/${locale === 'ar' ? cat.slugAr.current : cat.slugEn.current}`}
                className="text-sm font-body font-medium text-text-muted hover:text-purple-primary transition-colors"
              >
                {locale === 'ar' ? cat.titleAr : cat.titleEn}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Actions ────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}`}
              className="btn-primary py-2 px-4 text-sm"
            >
              {locale === 'ar' ? 'ابدأ الآن' : 'Get Started'}
            </Link>
          </div>

          {/* ── Mobile Menu Toggle ───────────────────────────────────────── */}
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark-base absolute inset-x-0 top-16 shadow-lg">
          <nav className="flex flex-col px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/${locale}/category/${locale === 'ar' ? cat.slugAr.current : cat.slugEn.current}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-body font-medium text-text-primary hover:text-purple-primary transition-colors block py-2 border-b border-dark-border/50"
              >
                <span className="me-2">{cat.icon}</span>
                {locale === 'ar' ? cat.titleAr : cat.titleEn}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href={`/${locale}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full text-center"
              >
                {locale === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
