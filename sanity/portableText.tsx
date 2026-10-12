'use client'

import React from 'react'
import { PortableText as SanityPortableText, type PortableTextComponents } from 'next-sanity'
import Image from 'next/image'
import { urlFor } from './image'
import type { SanityBlock } from './queries'
import { resolveAffiliateUrl } from '@/lib/affiliates'

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Anchor ID generator for headings (used by Table of Contents)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function slugify(text: unknown): string {
  if (!text) return ''
  const str = Array.isArray(text)
    ? text.map((t) => (typeof t === 'string' ? t : (t as { text?: string })?.text ?? '')).join('')
    : String(text)
  // Handle Arabic text â€” preserve Arabic characters in the ID
  return str
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-z0-9-]/gi, '')
    .toLowerCase()
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Star Rating Helper
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" aria-label={`Rating: ${rating} out of 5`}>
      {'â˜…'.repeat(full)}
      {half && 'Â½'}
      <span className="text-stone-300">{'â˜…'.repeat(empty)}</span>
      <span className="ms-1 text-text-muted text-xs font-body">{rating.toFixed(1)}</span>
    </span>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Portable Text Component Map
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const components: PortableTextComponents = {
  // â”€â”€ Block types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  block: {
    h2: ({ children, value }) => (
      <h2
        id={slugify((value?.children as { text?: string }[] | undefined)?.map((c) => c?.text))}
        className="font-arabic-heading font-bold text-text-primary mt-10 md:mt-12 mb-3 md:mb-4 leading-snug scroll-mt-24 text-[22px] sm:text-2xl md:text-3xl text-start text-balance ps-3 border-s-4 border-brand-primary/70"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugify((value?.children as { text?: string }[] | undefined)?.map((c) => c?.text))}
        className="font-arabic-heading font-bold text-text-primary mt-8 md:mt-10 mb-2 md:mb-3 leading-snug scroll-mt-24 text-[19px] sm:text-xl md:text-2xl text-start text-balance"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-arabic-heading font-bold text-text-primary mt-6 md:mt-8 mb-2 text-[17px] md:text-lg text-start">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-text-primary/90 leading-[1.75] rtl:leading-[1.95] text-[17px] md:text-[18px] mb-5 md:mb-6 text-start">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-s-4 border-brand-primary/60 bg-surface-card rounded-e-lg ps-4 pe-3 py-3 my-6 md:my-8 italic text-text-primary/80 text-base md:text-lg leading-[1.8] rtl:leading-[1.95]">
        {children}
      </blockquote>
    ),
  },

  // â”€â”€ Lists â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  list: {
    bullet: ({ children }) => (
      <ul className="text-text-primary/90 list-disc list-outside marker:text-brand-primary space-y-2.5 mb-6 ps-6 text-start">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-text-primary/90 list-decimal list-outside marker:text-brand-primary marker:font-semibold space-y-2.5 mb-6 ps-6 text-start">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.75] rtl:leading-[1.95] ps-1">{children}</li>,
    number: ({ children }) => <li className="leading-[1.75] rtl:leading-[1.95] ps-1">{children}</li>,
  },

  // â”€â”€ Marks (inline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        className="text-brand-primary underline decoration-brand-primary/30 hover:decoration-brand-primary underline-offset-4 transition-colors break-words"
      >
        {children}
      </a>
    ),
  },

  // â”€â”€ Custom types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  types: {
    // â”€â”€ Inline image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-7 md:my-8 -mx-4 sm:mx-0 max-w-[100vw] sm:max-w-full">
          <div className="relative w-full sm:rounded-xl sm:border sm:border-surface-border bg-surface-card sm:p-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(value).width(900).format('webp').url()}
              alt={value.alt ?? ''}
              className="w-full h-auto max-h-[70vh] sm:max-h-[500px] object-contain sm:rounded-lg"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-text-muted text-xs md:text-sm text-center mt-2.5 px-4 sm:px-0">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // â”€â”€ Amazon Product Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    amazonProductCard: ({ value }) => {
      if (!value?.name) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      // resolveAffiliateUrl handles both ASIN and raw URL, always injects the tag
      const affiliateUrl = resolveAffiliateUrl(
        { asin: value.asin, affiliateUrl: value.affiliateUrl },
        lang
      )

      const hasImg = Boolean(value.imageUrl)

      return (
        <div className="my-7 md:my-8 bg-surface-card rounded-xl border border-surface-border overflow-hidden max-w-full shadow-card">
          <div className={`grid ${hasImg ? 'grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[200px_minmax(0,1fr)]' : 'grid-cols-1'}`}>
            {/* Image */}
            {hasImg && (
              <div className="relative bg-white flex items-center justify-center p-2.5 sm:p-4 border-e border-surface-border sm:row-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value.imageUrl}
                  alt={value.name}
                  className="w-full h-auto max-h-28 sm:max-h-56 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            {/* Details */}
            <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-3 min-w-0">
              {value.badge && (
                <span className="inline-block bg-amber-100 border border-amber-300 text-amber-800 text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full w-fit max-w-full truncate">
                  {value.badge}
                </span>
              )}
              <h4 className="font-arabic-heading font-bold text-text-primary text-[15px] sm:text-lg leading-snug break-words line-clamp-3 sm:line-clamp-none">
                {value.name}
              </h4>
              {value.rating && (
                <div className="flex items-center gap-1.5 flex-wrap text-sm">
                  <StarRating rating={value.rating} />
                  {value.reviewCount && (
                    <span className="text-text-muted text-xs">({value.reviewCount.toLocaleString()})</span>
                  )}
                </div>
              )}
              {value.price && (
                <p className="text-text-primary font-bold text-lg sm:text-xl">
                  {value.price} <span className="text-text-muted text-sm font-normal">{lang === 'ar' ? 'Ø±.Ø³' : 'SAR'}</span>
                </p>
              )}
            </div>
            {/* CTA â€” full width under the image + details on phones, inline on sm+ */}
            {affiliateUrl && (
              <div className={`${hasImg ? 'col-span-2 sm:col-span-1 sm:col-start-2' : ''} px-3 pb-3 sm:px-5 sm:pb-5 sm:pt-0`}>
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark active:bg-brand-deep text-white text-[15px] font-bold w-full sm:w-auto sm:inline-flex min-h-[48px] px-6 rounded-lg transition-colors shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {lang === 'ar' ? 'Ø§Ø´ØªØ±ÙŠ Ø§Ù„Ø¢Ù† Ù…Ù† Ø£Ù…Ø§Ø²ÙˆÙ†' : 'Buy on Amazon'}
                </a>
              </div>
            )}
          </div>
        </div>
      )

    },

    // ── Product Comparison Table (VacuumWars-style Leaderboard) ───────────────
    productComparisonTable: ({ value }) => {
      if (!value?.products?.length) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      const isAr = lang === 'ar'

      const verdictLabels: Record<string, string> = {
        'best-overall': isAr ? '🥇 الأفضل على الإطلاق' : '🥇 Best Overall',
        'best-budget': isAr ? '💰 الأفضل قيمة وسعراً' : '💰 Best Budget',
        'best-premium': isAr ? '👑 الخيار الفاخر' : '👑 Best Premium',
        'editors-choice': isAr ? "✏️ اختيار المحررين" : "✏️ Editor's Choice",
      }

      // ── Inner row component (needs state for expand/collapse) ──
      function RankRow({ p, rankNumber, affiliateUrl, formattedScore, hasDetails }: {
        p: any
        rankNumber: number
        affiliateUrl: string | null
        formattedScore: string | null
        hasDetails: boolean
      }) {
        const [open, setOpen] = React.useState(false)

        const rankBadgeClass =
          rankNumber === 1
            ? 'bg-amber-400 text-stone-950 font-black'
            : rankNumber === 2
            ? 'bg-amber-300 text-stone-950 font-black'
            : rankNumber === 3
            ? 'bg-amber-200 text-stone-950 font-black'
            : 'bg-[#1E3A5F] text-white font-extrabold'

        const toggleOpen = () => { if (hasDetails) setOpen(o => !o) }

        return (
          <div className="border-b border-surface-border/60 last:border-b-0">
            {/* ── Desktop Row (sm+) ── */}
            <div
              className={`hidden sm:grid sm:grid-cols-[68px_minmax(0,1fr)_110px_190px] items-center gap-3 px-5 py-4 transition-colors ${hasDetails ? 'cursor-pointer hover:bg-stone-50' : ''}`}
              onClick={toggleOpen}
            >
              {/* 1. Rank Badge */}
              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center justify-center min-w-[38px] h-8 px-2.5 rounded-lg text-sm ${rankBadgeClass}`}
                  aria-label={`Rank #${rankNumber}`}
                >
                  #{rankNumber}
                </span>
              </div>

              {/* 2. Product (Image + Title + Verdict) */}
              <div className="flex items-center gap-3.5 min-w-0">
                {p.imageUrl ? (
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-white p-1 border border-surface-border/70 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 font-bold text-xs">
                    #{rankNumber}
                  </div>
                )}
                <div className="min-w-0 flex flex-col gap-0.5">
                  {p.verdict && (
                    <span className="inline-block bg-brand-primary/10 text-brand-primary text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit max-w-full truncate">
                      {verdictLabels[p.verdict] ?? p.verdict}
                    </span>
                  )}
                  <h4 className="font-heading font-bold text-text-primary text-[15px] leading-snug line-clamp-2">
                    {p.name}
                  </h4>
                </div>
              </div>

              {/* 3. Score */}
              <div className="flex items-center justify-center">
                {formattedScore ? (
                  <span className="inline-flex items-center gap-1 font-bold text-[15px] text-text-primary">
                    <span className="text-amber-500">★</span>
                    <span>{formattedScore}</span>
                  </span>
                ) : (
                  <span className="text-text-muted text-sm">—</span>
                )}
              </div>

              {/* 4. CTA + Chevron */}
              <div className="flex items-center justify-end gap-2">
                {affiliateUrl && (
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap min-h-[38px]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>{isAr ? 'شاهد في أمازون' : 'See at Amazon'}</span>
                  </a>
                )}
                {hasDetails && (
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 shrink-0">
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* ── Mobile Row (< sm) ── */}
            <div
              className={`sm:hidden p-3.5 transition-colors ${hasDetails ? 'cursor-pointer' : ''}`}
              onClick={toggleOpen}
            >
              {/* Top: Rank + Verdict + Score */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center min-w-[34px] h-7 px-2 rounded-md text-xs ${rankBadgeClass}`}>
                    #{rankNumber}
                  </span>
                  {p.verdict && (
                    <span className="inline-block bg-brand-primary/10 text-brand-primary text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[150px]">
                      {verdictLabels[p.verdict] ?? p.verdict}
                    </span>
                  )}
                </div>
                {formattedScore && (
                  <span className="inline-flex items-center gap-1 font-bold text-xs text-text-primary">
                    <span className="text-amber-500">★</span>
                    <span>{formattedScore}</span>
                  </span>
                )}
              </div>

              {/* Middle: Thumbnail + Name */}
              <div className="flex items-center gap-3 mb-3">
                {p.imageUrl && (
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-white p-1 border border-surface-border/70 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                  </div>
                )}
                <h4 className="font-heading font-bold text-text-primary text-sm leading-snug line-clamp-2">{p.name}</h4>
              </div>

              {/* Bottom: CTA + Chevron */}
              <div className="flex items-center gap-2">
                {affiliateUrl && (
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-xs px-3 py-2.5 rounded-xl transition-colors min-h-[40px]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>{isAr ? 'شاهد في أمازون' : 'See at Amazon'}</span>
                  </a>
                )}
                {hasDetails && (
                  <span className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* ── Expanded Details Drawer ── */}
            {hasDetails && open && (
              <div className="border-t border-surface-border/60 bg-[#FAF9F5] px-4 sm:px-6 py-4 sm:py-5">
                {p.verdict && (
                  <div className="mb-3 text-xs font-semibold text-brand-primary">
                    {verdictLabels[p.verdict] ?? p.verdict}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {p.pros && p.pros.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 sm:p-3.5">
                      <div className="text-emerald-800 font-bold text-xs mb-2 flex items-center gap-1.5">
                        <span>✓</span><span>{isAr ? 'المميزات' : 'Pros'}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-text-primary/90">
                        {p.pros.map((pro: string, pIdx: number) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {p.cons && p.cons.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-3 sm:p-3.5">
                      <div className="text-rose-800 font-bold text-xs mb-2 flex items-center gap-1.5">
                        <span>✕</span><span>{isAr ? 'العيوب' : 'Cons'}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-text-primary/90">
                        {p.cons.map((con: string, cIdx: number) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <span className="text-rose-600 font-bold shrink-0">✕</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {affiliateUrl && (
                  <div className="mt-3 pt-3 border-t border-surface-border/40 flex justify-end">
                    <a
                      href={affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>{isAr ? `عرض ${p.name} على أمازون` : `View ${p.name} on Amazon`}</span>
                      <span>{isAr ? '←' : '→'}</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }

      return (
        <div className="my-8 md:my-12">
          {/* Eyebrow & Title */}
          <div className="mb-4">
            <span className="text-[12px] font-bold uppercase tracking-wider text-brand-primary block mb-1">
              {isAr ? 'الترتيب والتصنيف' : 'THE RANKING'}
            </span>
            <h3 className="font-arabic-heading font-extrabold text-text-primary text-xl sm:text-2xl md:text-3xl tracking-tight text-start">
              {value.heading || (isAr ? 'أفضل الخيارات' : 'The Top Picks')}
            </h3>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
            {/* Desktop Header Row */}
            <div className="hidden sm:grid sm:grid-cols-[68px_minmax(0,1fr)_110px_190px] items-center gap-3 bg-[#FAF9F5] border-b border-surface-border/80 px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
              <span className="text-center">{isAr ? 'الترتيب' : 'RANK'}</span>
              <span className="text-start ps-1">{isAr ? 'المنتج' : 'PRODUCT'}</span>
              <span className="text-center">{isAr ? 'التقييم' : 'SCORE'}</span>
              <span className="text-center">{isAr ? 'الشراء' : 'ACTION'}</span>
            </div>

            {/* Product Rows */}
            {value.products.map((p: any, i: number) => {
              const affiliateUrl = resolveAffiliateUrl(
                { asin: p.asin, affiliateUrl: p.affiliateUrl },
                lang
              )
              const formattedScore =
                typeof p.rating === 'number'
                  ? p.rating % 1 === 0
                    ? p.rating.toFixed(1)
                    : p.rating.toFixed(2)
                  : null
              const hasDetails = Boolean(
                p.verdict || (p.pros && p.pros.length > 0) || (p.cons && p.cons.length > 0)
              )
              return (
                <RankRow
                  key={i}
                  p={p}
                  rankNumber={i + 1}
                  affiliateUrl={affiliateUrl}
                  formattedScore={formattedScore}
                  hasDetails={hasDetails}
                />
              )
            })}
          </div>
        </div>
      )
    },

    // â”€â”€ Pros & Cons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    prosConsBlock: ({ value }) => {
      if (!value?.pros?.length && !value?.cons?.length) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      return (
        <div className="my-7 md:my-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {value.pros?.length > 0 && (
            <div className="bg-state-success/5 border border-state-success/20 rounded-xl p-4 sm:p-5">
              <h4 className="font-arabic-heading font-bold text-state-success mb-3 flex items-center gap-2 text-lg">
                <span>âœ…</span>
                {lang === 'ar' ? 'Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª' : 'Pros'}
              </h4>
              <ul className="space-y-2.5">
                {value.pros.map((pro: string, i: number) => (
                  <li key={i} className="text-text-primary/90 text-[15px] leading-relaxed flex items-start gap-2">
                    <span className="text-state-success mt-0.5 shrink-0">âœ“</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {value.cons?.length > 0 && (
            <div className="bg-state-error/5 border border-state-error/20 rounded-xl p-4 sm:p-5">
              <h4 className="font-arabic-heading font-bold text-state-error mb-3 flex items-center gap-2 text-lg">
                <span>âŒ</span>
                {lang === 'ar' ? 'Ø§Ù„Ø¹ÙŠÙˆØ¨' : 'Cons'}
              </h4>
              <ul className="space-y-2.5">
                {value.cons.map((con: string, i: number) => (
                  <li key={i} className="text-text-primary/90 text-[15px] leading-relaxed flex items-start gap-2">
                    <span className="text-state-error mt-0.5 shrink-0">âœ—</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    },

    // â”€â”€ FAQ Block â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    faqBlock: ({ value }) => {
      if (!value?.items?.length) return null
      const lang = (value._language as 'ar' | 'en') ?? 'ar'
      return (
        <div className="my-8 md:my-10">
          <h3 className="font-arabic-heading font-bold text-text-primary text-[19px] sm:text-xl mb-4 md:mb-6 text-start">
            {lang === 'ar' ? 'Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©' : 'Frequently Asked Questions'}
          </h3>
          <div className="space-y-3">
            {value.items.map((item: { question: string; answer: string }, i: number) => (
              <details key={i} className="bg-surface-card border border-surface-border rounded-xl group open:shadow-card open:border-brand-primary/30">
                <summary className="px-4 sm:px-5 py-3.5 min-h-[52px] cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3 select-none">
                  <span className="font-arabic-heading font-semibold text-text-primary text-[15px] sm:text-base leading-snug text-start">
                    {item.question}
                  </span>
                  <svg
                    className="text-brand-primary shrink-0 transition-transform duration-200 group-open:rotate-180"
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-text-primary/85 text-[15px] leading-[1.8] rtl:leading-[1.95] text-start border-t border-surface-border/60 pt-3.5">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      )
    },

    // â”€â”€ Callout Block â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    calloutBlock: ({ value }) => {
      if (!value?.text) return null
      const styles: Record<string, { border: string; bg: string; icon: string; label: string }> = {
        tip:       { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5',  icon: 'ðŸ’¡', label: 'Tip' },
        info:      { border: 'border-blue-500/30',    bg: 'bg-blue-500/5',     icon: 'â„¹ï¸', label: 'Info' },
        warning:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/5',    icon: 'âš ï¸', label: 'Warning' },
        important: { border: 'border-red-500/30',     bg: 'bg-red-500/5',      icon: 'ðŸ”´', label: 'Important' },
      }
      const s = styles[value.type ?? 'info'] ?? styles.info
      return (
        <div className={`my-7 md:my-8 p-3.5 sm:p-4 rounded-xl border ${s.border} ${s.bg}`}>
          <p className="text-text-primary/90 text-[15px] leading-[1.75] rtl:leading-[1.95] text-start">
            <span className="me-2">{s.icon}</span>
            {value.text}
          </p>
        </div>
      )
    },
  },
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Export
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface PortableTextProps {
  value: SanityBlock[]
}

export function PortableText({ value }: PortableTextProps) {
  return <SanityPortableText value={value} components={components} />
}

