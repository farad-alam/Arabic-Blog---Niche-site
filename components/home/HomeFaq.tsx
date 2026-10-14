'use client'

import { useState } from 'react'
import { type Locale } from '@/lib/i18n'

export interface FaqEntry {
  q: string
  a: string
}

interface HomeFaqProps {
  locale: Locale
  /** CMS-driven FAQ items (question + answer already resolved for the locale) */
  faqs: FaqEntry[]
  /** Section badge/pill text — from Site Settings */
  badge?: string
  /** Section heading — from Site Settings */
  heading?: string
}

export default function HomeFaq({ locale, faqs, badge, heading }: HomeFaqProps) {
  const isAr = locale === 'ar'
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  if (faqs.length === 0) return null

  const sectionBadge = badge || (isAr ? 'الأسئلة الشائعة' : 'FAQ')
  const sectionHeading = heading || (isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions')

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary block mb-2">
          {sectionBadge}
        </span>
        <h2 className="font-arabic-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-text-primary">
          {sectionHeading}
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-start hover:bg-surface-raised transition-colors focus:outline-none"
                aria-expanded={isOpen}
              >
                <h3 className="font-arabic-heading font-bold text-base sm:text-lg text-text-primary">
                  {faq.q}
                </h3>
                <span className="w-8 h-8 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center shrink-0 text-text-muted">
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-text-muted leading-relaxed font-body border-t border-surface-border/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
