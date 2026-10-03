'use client'

import { PortableText as SanityPortableText, type PortableTextComponents } from 'next-sanity'
import Image from 'next/image'
import { urlFor } from './image'
import type { SanityBlock } from './queries'
import { resolveAffiliateUrl } from '@/lib/affiliates'

// ─────────────────────────────────────────────────────────────────────────────
// Anchor ID generator for headings (used by Table of Contents)
// ─────────────────────────────────────────────────────────────────────────────

function slugify(text: unknown): string {
  if (!text) return ''
  const str = Array.isArray(text)
    ? text.map((t) => (typeof t === 'string' ? t : (t as { text?: string })?.text ?? '')).join('')
    : String(text)
  // Handle Arabic text — preserve Arabic characters in the ID
  return str
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-z0-9-]/gi, '')
    .toLowerCase()
}

// ─────────────────────────────────────────────────────────────────────────────
// Star Rating Helper
// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" aria-label={`Rating: ${rating} out of 5`}>
      {'★'.repeat(full)}
      {half && '½'}
      <span className="text-gray-600">{'★'.repeat(empty)}</span>
      <span className="ms-1 text-text-muted text-xs font-body">{rating.toFixed(1)}</span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Portable Text Component Map
// ─────────────────────────────────────────────────────────────────────────────

const components: PortableTextComponents = {
  // ── Block types ────────────────────────────────────────────────────────────
  block: {
    h2: ({ children, value }) => (
      <h2
        id={slugify((value?.children as { text?: string }[] | undefined)?.map((c) => c?.text))}
        className="font-arabic-heading font-bold text-text-primary mt-12 mb-4 leading-snug scroll-mt-24 text-2xl md:text-3xl rtl:text-right ltr:text-left"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugify((value?.children as { text?: string }[] | undefined)?.map((c) => c?.text))}
        className="font-arabic-heading font-bold text-text-primary mt-10 mb-3 leading-snug scroll-mt-24 text-xl md:text-2xl rtl:text-right ltr:text-left"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-arabic-heading font-bold text-text-primary mt-8 mb-2 text-lg rtl:text-right ltr:text-left">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-text-muted leading-[1.8] text-[17px] md:text-[18px] mb-6 rtl:text-right ltr:text-left">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="rtl:border-r-2 ltr:border-l-2 border-purple-primary/50 rtl:pr-5 ltr:pl-5 my-8 italic text-text-muted text-lg leading-[1.8]">
        {children}
      </blockquote>
    ),
  },

  // ── Lists ──────────────────────────────────────────────────────────────────
  list: {
    bullet: ({ children }) => (
      <ul className="text-text-muted list-disc rtl:list-inside ltr:list-inside space-y-2 mb-6 rtl:pr-4 ltr:pl-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-text-muted list-decimal rtl:list-inside ltr:list-inside space-y-2 mb-6 rtl:pr-4 ltr:pl-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.8]">{children}</li>,
    number: ({ children }) => <li className="leading-[1.8]">{children}</li>,
  },

  // ── Marks (inline) ─────────────────────────────────────────────────────────
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={[
          value?.blank ? 'noopener noreferrer' : '',
          value?.nofollow ? 'nofollow' : '',
        ].filter(Boolean).join(' ') || undefined}
        className="text-purple-primary hover:underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },

  // ── Custom types ───────────────────────────────────────────────────────────
  types: {
    // ── Inline image ──────────────────────────────────────────────────────────
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8 max-w-full overflow-hidden">
          <div className="relative w-full rounded-xl border border-surface-border bg-surface-card p-2 sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(value).width(900).format('webp').url()}
              alt={value.alt ?? ''}
              className="w-full h-auto max-h-[400px] md:max-h-[500px] object-contain rounded-lg"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="text-text-muted text-xs text-center mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // ── Amazon Product Card ───────────────────────────────────────────────────
    amazonProductCard: ({ value }) => {
      if (!value?.name) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      // resolveAffiliateUrl handles both ASIN and raw URL, always injects the tag
      const affiliateUrl = resolveAffiliateUrl(
        { asin: value.asin, affiliateUrl: value.affiliateUrl },
        lang
      )

      return (
        <div className="my-8 bg-surface-card rounded-xl border border-surface-border overflow-hidden max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
            {/* Image */}
            {value.imageUrl && (
              <div className="relative bg-white flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-e border-surface-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value.imageUrl}
                  alt={value.name}
                  className="w-full h-auto max-h-56 object-contain"
                  loading="lazy"
                />
              </div>
            )}
            {/* Details */}
            <div className="p-5 flex flex-col gap-3 min-w-0">
              {value.badge && (
                <span className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs px-2.5 py-1 rounded-full w-fit">
                  {value.badge}
                </span>
              )}
              <h4 className="font-arabic-heading font-bold text-text-primary text-lg leading-snug break-words">
                {value.name}
              </h4>
              {value.rating && (
                <div className="flex items-center gap-2 flex-wrap">
                  <StarRating rating={value.rating} />
                  {value.reviewCount && (
                    <span className="text-text-muted text-xs">({value.reviewCount.toLocaleString()})</span>
                  )}
                </div>
              )}
              {value.price && (
                <p className="text-text-primary font-bold text-xl">{value.price}</p>
              )}
              {affiliateUrl && (
                <div className="mt-auto pt-2">
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-center gap-2 bg-[#FFA41C] hover:bg-[#FA8900] text-black text-sm font-bold w-full sm:w-auto min-h-[44px] px-6 rounded-lg transition-colors shadow-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    {lang === 'ar' ? 'اشتري الآن من أمازون' : 'Buy on Amazon'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },

    // ── Product Comparison Table ──────────────────────────────────────────────
    productComparisonTable: ({ value }) => {
      if (!value?.products?.length) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      const verdictLabels: Record<string, string> = {
        'best-overall': lang === 'ar' ? '🥇 الأفضل' : '🥇 Best Overall',
        'best-budget': lang === 'ar' ? '💰 الأوفر' : '💰 Best Budget',
        'best-premium': lang === 'ar' ? '👑 الأفخم' : '👑 Best Premium',
        'editors-choice': lang === 'ar' ? "✏️ اختيار المحررين" : "✏️ Editor's Choice",
      }

      return (
        <div className="my-10">
          {value.heading && (
            <h3 className="font-arabic-heading font-bold text-text-primary text-xl mb-6 rtl:text-right ltr:text-left">
              {value.heading}
            </h3>
          )}
          {/* Mobile: scrollable cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:hidden">
            {value.products.map((p: any, i: number) => (
              <div key={i} className="min-w-[260px] bg-surface-card rounded-xl border border-surface-border p-4 shrink-0">
                {p.verdict && (
                  <span className="inline-block bg-purple-primary/10 text-purple-primary text-xs px-2 py-0.5 rounded-full mb-3">
                    {verdictLabels[p.verdict] ?? p.verdict}
                  </span>
                )}
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-contain bg-white rounded-lg mb-3 p-2" loading="lazy" />
                )}
                <h4 className="font-bold text-text-primary text-sm mb-1">{p.name}</h4>
                {p.rating && <StarRating rating={p.rating} />}
                {p.price && <p className="font-bold text-text-primary mt-2">{p.price}</p>}
{(() => {
                    const url = resolveAffiliateUrl({ asin: p.asin, affiliateUrl: p.affiliateUrl }, lang)
                    return url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center justify-center gap-1.5 bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold text-xs w-full mt-3 min-h-[44px] rounded-lg transition-colors shadow-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {lang === 'ar' ? 'أمازون' : 'Amazon'}
                      </a>
                    ) : null
                  })()}
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-surface-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-card border-b border-surface-border">
                  <th className="p-4 text-text-muted font-medium rtl:text-right ltr:text-left">
                    {lang === 'ar' ? 'المنتج' : 'Product'}
                  </th>
                  {value.products.map((p: any, i: number) => (
                    <th key={i} className="p-4 text-center">
                      {p.verdict && (
                        <span className="block bg-purple-primary/10 text-purple-primary text-xs px-2 py-0.5 rounded-full mb-2 mx-auto w-fit">
                          {verdictLabels[p.verdict] ?? p.verdict}
                        </span>
                      )}
                      {p.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-contain mx-auto bg-white rounded p-1 mb-2" loading="lazy" />
                      )}
                      <span className="font-semibold text-text-primary">{p.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-border/50">
                  <td className="p-4 text-text-muted">{lang === 'ar' ? 'التقييم' : 'Rating'}</td>
                  {value.products.map((p: any, i: number) => (
                    <td key={i} className="p-4 text-center">
                      {p.rating ? <StarRating rating={p.rating} /> : '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-surface-border/50">
                  <td className="p-4 text-text-muted">{lang === 'ar' ? 'السعر' : 'Price'}</td>
                  {value.products.map((p: any, i: number) => (
                    <td key={i} className="p-4 text-center font-bold text-text-primary">{p.price ?? '—'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-text-muted">{lang === 'ar' ? 'الشراء' : 'Buy'}</td>
                  {value.products.map((p: any, i: number) => (
                    <td key={i} className="p-4 text-center">
                      {(() => {
                        const url = resolveAffiliateUrl({ asin: p.asin, affiliateUrl: p.affiliateUrl }, lang)
                        return url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center justify-center gap-1.5 bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold text-xs min-h-[44px] px-4 rounded-lg transition-colors shadow-sm"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1"></circle>
                              <circle cx="20" cy="21" r="1"></circle>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {lang === 'ar' ? 'أمازون' : 'Amazon'}
                          </a>
                        ) : '—'
                      })()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },

    // ── Pros & Cons ───────────────────────────────────────────────────────────
    prosConsBlock: ({ value }) => {
      if (!value?.pros?.length && !value?.cons?.length) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      return (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {value.pros?.length > 0 && (
            <div className="bg-state-success/5 border border-state-success/20 rounded-xl p-5">
              <h4 className="font-arabic-heading font-bold text-state-success mb-3 flex items-center gap-2 text-lg">
                <span>✅</span>
                {lang === 'ar' ? 'المميزات' : 'Pros'}
              </h4>
              <ul className="space-y-2">
                {value.pros.map((pro: string, i: number) => (
                  <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                    <span className="text-state-success mt-0.5 shrink-0">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {value.cons?.length > 0 && (
            <div className="bg-state-error/5 border border-state-error/20 rounded-xl p-5">
              <h4 className="font-arabic-heading font-bold text-state-error mb-3 flex items-center gap-2 text-lg">
                <span>❌</span>
                {lang === 'ar' ? 'العيوب' : 'Cons'}
              </h4>
              <ul className="space-y-2">
                {value.cons.map((con: string, i: number) => (
                  <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                    <span className="text-state-error mt-0.5 shrink-0">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    },

    // ── FAQ Block ─────────────────────────────────────────────────────────────
    faqBlock: ({ value }) => {
      if (!value?.items?.length) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      return (
        <div className="my-10">
          <h3 className="font-arabic-heading font-bold text-text-primary text-xl mb-6 rtl:text-right ltr:text-left">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h3>
          <div className="space-y-4">
            {value.items.map((item: { question: string; answer: string }, i: number) => (
              <details key={i} className="bg-surface-card border border-surface-border rounded-xl group">
                <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4 select-none">
                  <span className="font-arabic-heading font-semibold text-text-primary rtl:text-right ltr:text-left">
                    {item.question}
                  </span>
                  <span className="text-purple-primary shrink-0 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-5 pb-5 text-text-muted text-sm leading-[1.8] rtl:text-right ltr:text-left border-t border-surface-border/50 mt-0 pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      )
    },

    // ── Callout Block ─────────────────────────────────────────────────────────
    calloutBlock: ({ value }) => {
      if (!value?.text) return null
      const styles: Record<string, { border: string; bg: string; icon: string; label: string }> = {
        tip:       { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5',  icon: '💡', label: 'Tip' },
        info:      { border: 'border-blue-500/30',    bg: 'bg-blue-500/5',     icon: 'ℹ️', label: 'Info' },
        warning:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/5',    icon: '⚠️', label: 'Warning' },
        important: { border: 'border-red-500/30',     bg: 'bg-red-500/5',      icon: '🔴', label: 'Important' },
      }
      const s = styles[value.type ?? 'info'] ?? styles.info
      return (
        <div className={`my-8 p-4 rounded-xl border ${s.border} ${s.bg}`}>
          <p className="text-text-muted text-sm leading-[1.8] rtl:text-right ltr:text-left">
            <span className="me-2">{s.icon}</span>
            {value.text}
          </p>
        </div>
      )
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

interface PortableTextProps {
  value: SanityBlock[]
}

export function PortableText({ value }: PortableTextProps) {
  return <SanityPortableText value={value} components={components} />
}
