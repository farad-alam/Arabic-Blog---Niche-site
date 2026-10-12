'use client'

import React, { useState } from 'react'
import { resolveAffiliateUrl } from '@/lib/affiliates'

export interface ProductItem {
  _key?: string
  name: string
  imageUrl?: string
  rating?: number
  asin?: string
  affiliateUrl?: string
  verdict?: 'best-overall' | 'best-budget' | 'best-premium' | 'editors-choice' | string
  pros?: string[]
  cons?: string[]
}

export interface ProductComparisonTableProps {
  heading?: string
  products: ProductItem[]
  language?: 'ar' | 'en'
}

const VERDICT_LABELS_AR: Record<string, string> = {
  'best-overall':   '🥇 الأفضل على الإطلاق',
  'best-budget':    '💰 الأفضل قيمة وسعراً',
  'best-premium':   '👑 الخيار الفاخر',
  'editors-choice': '✏️ اختيار المحررين',
}

const VERDICT_LABELS_EN: Record<string, string> = {
  'best-overall':   '🥇 Best Overall',
  'best-budget':    '💰 Best Budget',
  'best-premium':   '👑 Best Premium',
  'editors-choice': "✏️ Editor's Choice",
}

function ProductRow({
  product,
  rankNumber,
  isAr,
  lang,
}: {
  product: ProductItem
  rankNumber: number
  isAr: boolean
  lang: 'ar' | 'en'
}) {
  const [open, setOpen] = useState(false)
  const verdictLabels = isAr ? VERDICT_LABELS_AR : VERDICT_LABELS_EN

  const affiliateUrl = resolveAffiliateUrl(
    { asin: product.asin, affiliateUrl: product.affiliateUrl },
    lang
  )

  const formattedScore =
    typeof product.rating === 'number'
      ? product.rating % 1 === 0
        ? product.rating.toFixed(1)
        : product.rating.toFixed(2)
      : null

  const hasDetails = Boolean(
    product.verdict ||
    (product.pros && product.pros.length > 0) ||
    (product.cons && product.cons.length > 0)
  )

  const rankBadgeClass =
    rankNumber === 1
      ? 'bg-amber-400 text-stone-950 font-black'
      : rankNumber === 2
      ? 'bg-amber-300 text-stone-950 font-black'
      : rankNumber === 3
      ? 'bg-amber-200 text-stone-950 font-black'
      : 'bg-[#1E3A5F] text-white font-extrabold'

  const toggleOpen = () => {
    if (hasDetails) {
      setOpen((prev) => !prev)
    }
  }

  return (
    <div className="border-b border-surface-border/60 last:border-b-0">
      {/* ── Desktop Row (sm+) ── */}
      <div
        className={`hidden sm:grid sm:grid-cols-[64px_minmax(0,1fr)_100px_180px] items-center gap-3 px-4 sm:px-5 py-4 transition-colors ${
          hasDetails ? 'cursor-pointer hover:bg-stone-50/80' : ''
        }`}
        onClick={toggleOpen}
      >
        {/* 1. Rank Badge */}
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center justify-center min-w-[36px] h-8 px-2.5 rounded-lg text-sm shadow-sm ${rankBadgeClass}`}
            aria-label={`Rank #${rankNumber}`}
          >
            #{rankNumber}
          </span>
        </div>

        {/* 2. Product (Image + Title + Verdict) */}
        <div className="flex items-center gap-3.5 min-w-0">
          {product.imageUrl ? (
            <div className="w-14 h-14 shrink-0 rounded-lg bg-white p-1 border border-surface-border/70 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
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
            {product.verdict && (
              <span className="inline-block bg-brand-primary/10 text-brand-primary text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit max-w-full truncate">
                {verdictLabels[product.verdict] ?? product.verdict}
              </span>
            )}
            <h4 className="font-heading font-bold text-text-primary text-[15px] leading-snug line-clamp-2">
              {product.name}
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
              className="inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap min-h-[38px] shadow-sm"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>{isAr ? 'شاهد في أمازون' : 'See at Amazon'}</span>
            </a>
          )}
          {hasDetails && (
            <button
              type="button"
              aria-label={open ? (isAr ? 'إخفاء التفاصيل' : 'Hide details') : (isAr ? 'عرض التفاصيل' : 'Show details')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleOpen()
              }}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Row (< sm) ── */}
      <div
        className={`sm:hidden p-3.5 transition-colors ${
          hasDetails ? 'cursor-pointer hover:bg-stone-50/50' : ''
        }`}
        onClick={toggleOpen}
      >
        {/* Top: Rank + Verdict + Score */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center min-w-[34px] h-7 px-2 rounded-md text-xs shadow-sm ${rankBadgeClass}`}
            >
              #{rankNumber}
            </span>
            {product.verdict && (
              <span className="inline-block bg-brand-primary/10 text-brand-primary text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[150px]">
                {verdictLabels[product.verdict] ?? product.verdict}
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
          {product.imageUrl && (
            <div className="w-12 h-12 shrink-0 rounded-lg bg-white p-1 border border-surface-border/70 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <h4 className="font-heading font-bold text-text-primary text-sm leading-snug line-clamp-2">
            {product.name}
          </h4>
        </div>

        {/* Bottom: CTA + Chevron */}
        <div className="flex items-center gap-2">
          {affiliateUrl && (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-xs px-3 py-2.5 rounded-xl transition-colors min-h-[40px] shadow-sm"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>{isAr ? 'شاهد في أمازون' : 'See at Amazon'}</span>
            </a>
          )}
          {hasDetails && (
            <button
              type="button"
              aria-label={open ? (isAr ? 'إخفاء التفاصيل' : 'Hide details') : (isAr ? 'عرض التفاصيل' : 'Show details')}
              className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleOpen()
              }}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded Details Drawer (rendered in DOM for SEO crawlability) ── */}
      {hasDetails && (
        <div
          className={`border-t border-surface-border/60 bg-[#FAF9F5] px-4 sm:px-6 py-4 sm:py-5 ${
            open ? 'block' : 'hidden'
          }`}
        >
          {product.verdict && (
            <div className="mb-3 text-xs font-semibold text-brand-primary">
              {verdictLabels[product.verdict] ?? product.verdict}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {product.pros && product.pros.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 sm:p-3.5">
                <div className="text-emerald-800 font-bold text-xs mb-2 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{isAr ? 'المميزات' : 'Pros'}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-text-primary/90">
                  {product.pros.map((pro, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons && product.cons.length > 0 && (
              <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-3 sm:p-3.5">
                <div className="text-rose-800 font-bold text-xs mb-2 flex items-center gap-1.5">
                  <span>✕</span>
                  <span>{isAr ? 'العيوب' : 'Cons'}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-text-primary/90">
                  {product.cons.map((con, cIdx) => (
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
                <span>{isAr ? `عرض ${product.name} على أمازون` : `View ${product.name} on Amazon`}</span>
                <span>{isAr ? '←' : '→'}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ProductComparisonTable({
  heading,
  products,
  language = 'ar',
}: ProductComparisonTableProps) {
  if (!products || products.length === 0) return null
  const isAr = language === 'ar'

  return (
    <div className="my-8 md:my-12">
      {/* Eyebrow & Title */}
      <div className="mb-4">
        <span className="text-[12px] font-bold uppercase tracking-wider text-brand-primary block mb-1">
          {isAr ? 'الترتيب والتصنيف' : 'THE RANKING'}
        </span>
        <h3 className="font-arabic-heading font-extrabold text-text-primary text-xl sm:text-2xl md:text-3xl tracking-tight text-start">
          {heading || (isAr ? 'أفضل الخيارات' : 'The Top Picks')}
        </h3>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden sm:grid sm:grid-cols-[64px_minmax(0,1fr)_100px_180px] items-center gap-3 bg-[#FAF9F5] border-b border-surface-border/80 px-4 sm:px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
          <span className="text-center">{isAr ? 'الترتيب' : 'RANK'}</span>
          <span className="text-start ps-1">{isAr ? 'المنتج' : 'PRODUCT'}</span>
          <span className="text-center">{isAr ? 'التقييم' : 'SCORE'}</span>
          <span className="text-center">{isAr ? 'الشراء' : 'ACTION'}</span>
        </div>

        {/* Rows */}
        {products.map((p, i) => (
          <ProductRow
            key={p._key || i}
            product={p}
            rankNumber={i + 1}
            isAr={isAr}
            lang={language}
          />
        ))}
      </div>
    </div>
  )
}
