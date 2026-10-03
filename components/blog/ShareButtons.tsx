'use client'

import { useEffect, useState } from 'react'

interface ShareButtonsProps {
  title: string
  slug: string
  locale?: 'ar' | 'en'
}

const btn =
  'inline-flex items-center justify-center gap-2 min-h-[48px] px-3 rounded-xl border border-surface-border bg-surface-card text-text-primary text-sm font-medium transition-all duration-150 active:scale-[0.97] hover:border-purple-primary/40 hover:text-purple-primary'

export default function ShareButtons({ title, slug, locale = 'ar' }: ShareButtonsProps) {
  const isAr = locale === 'ar'
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  const url = `${base}/${locale}/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const t = {
    heading: isAr ? 'شارك المقال' : 'Share this article',
    share: isAr ? 'مشاركة' : 'Share',
    copy: isAr ? 'نسخ الرابط' : 'Copy link',
    copied: isAr ? 'تم النسخ!' : 'Copied!',
  }

  // Web Share API = the OS share sheet (WhatsApp, Telegram, Messages…) on phones
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // user dismissed the sheet — nothing to do
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: silently fail
    }
  }

  return (
    <section
      aria-label={t.heading}
      className="my-8 md:my-10 py-5 md:py-6 border-t border-b border-surface-border"
    >
      <h2 className="font-arabic-heading font-bold text-text-primary text-base mb-3">{t.heading}</h2>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="md:hidden w-full mb-3 inline-flex items-center justify-center gap-2 min-h-[52px] rounded-xl bg-purple-primary text-white font-bold text-[15px] shadow-sm active:bg-purple-deep transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {t.share}
        </button>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isAr ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}
          className={`${btn} !border-[#25D366]/40 !text-[#128C7E] hover:!bg-[#25D366]/10`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isAr ? 'مشاركة على فيسبوك' : 'Share on Facebook'}
          className={`${btn} !border-[#1877F2]/30 !text-[#1877F2] hover:!bg-[#1877F2]/10`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.931-1.956 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
          Facebook
        </a>

        {/* Twitter / X */}
        <a
          href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=motionbiteit`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isAr ? 'مشاركة على X' : 'Share on X / Twitter'}
          className={btn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>

        {/* Copy Link */}
        <button type="button" onClick={handleCopy} aria-label={t.copy} className={btn}>
          {copied ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span role="status">{t.copied}</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {t.copy}
            </>
          )}
        </button>
      </div>
    </section>
  )
}
