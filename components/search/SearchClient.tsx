'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { type Locale, formatDateShort, t } from '@/lib/i18n'

type Entry = {
  title: string
  slug: string
  language: 'ar' | 'en'
  excerpt: string
  publishedAt: string
  categoryTitle: string
  image: string | null
  imageAlt: string
}

/** Strip Arabic diacritics/tatweel, unify alef/ya/ta-marbuta and lowercase — so searching is forgiving. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim()
}

export default function SearchClient({ locale }: { locale: Locale }) {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params.get('q') ?? ''

  const [input, setInput] = useState(initial)
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [failed, setFailed] = useState(false)

  // Keep the box in sync when the URL changes (e.g. navbar search)
  useEffect(() => setInput(params.get('q') ?? ''), [params])

  useEffect(() => {
    let cancelled = false
    fetch('/search-index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data: Entry[]) => !cancelled && setEntries(data))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [])

  const query = normalize(initial)

  const results = useMemo(() => {
    if (!entries || !query) return []
    const terms = query.split(/\s+/).filter(Boolean)
    return entries
      .filter((e) => e.language === locale)
      .map((e) => {
        const title = normalize(e.title)
        const rest = normalize(`${e.excerpt} ${e.categoryTitle}`)
        let score = 0
        for (const term of terms) {
          if (title.includes(term)) score += 3
          else if (rest.includes(term)) score += 1
          else return null // every term must match somewhere
        }
        return { e, score }
      })
      .filter((r): r is { e: Entry; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.e)
  }, [entries, query, locale])

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const q = input.trim()
    router.push(`/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  return (
    <div>
      <form onSubmit={submit} role="search" className="relative max-w-2xl">
        <Search size={20} className="absolute top-1/2 -translate-y-1/2 start-5 text-text-muted pointer-events-none" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="search"
          autoFocus={!initial}
          placeholder={t(locale, 'search.placeholder')}
          aria-label={t(locale, 'nav.search')}
          className="w-full h-14 ps-14 pe-28 rounded-full bg-surface-card border border-surface-border text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/15 transition-all"
        />
        <button
          type="submit"
          className="absolute top-1.5 bottom-1.5 end-1.5 px-6 rounded-full bg-brand-primary hover:bg-brand-gradient text-white text-sm font-bold transition-colors"
        >
          {t(locale, 'nav.search')}
        </button>
      </form>

      <div className="mt-10">
        {!initial.trim() ? (
          <p className="text-text-muted">{t(locale, 'search.hint')}</p>
        ) : failed ? (
          <p className="text-state-error">
            {locale === 'ar' ? 'تعذّر تحميل البحث. حاول مرة أخرى لاحقاً.' : 'Could not load search. Please try again later.'}
          </p>
        ) : entries === null ? (
          <p className="text-text-muted">{t(locale, 'search.loading')}</p>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-10 text-center">
            <div className="text-4xl mb-3 opacity-60">🔍</div>
            <p className="text-text-muted">{t(locale, 'search.noResults')}</p>
          </div>
        ) : (
          <>
            <p className="text-text-muted text-sm mb-6">
              {t(locale, 'search.resultsFor')} “<span className="text-text-primary">{initial}</span>” — {results.length}
            </p>
            <ul className="grid grid-cols-1 gap-4">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/${locale}/${r.slug}`}
                    className="group flex gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-primary/40 transition-colors"
                  >
                    <div className="relative w-28 sm:w-44 aspect-video shrink-0 rounded-xl overflow-hidden bg-surface-base">
                      {r.image ? (
                        <Image src={r.image} alt={r.imageAlt} fill sizes="176px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-50">📝</div>
                      )}
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      {r.categoryTitle && (
                        <span className="text-[11px] font-semibold text-brand-primary mb-1.5">{r.categoryTitle}</span>
                      )}
                      <h2 className="font-arabic-heading font-bold text-text-primary text-base sm:text-lg leading-snug group-hover:text-brand-light transition-colors">
                        {r.title}
                      </h2>
                      {r.excerpt && <p className="text-text-muted text-sm mt-1.5 line-clamp-2 !text-sm !leading-relaxed">{r.excerpt}</p>}
                      <span className="text-xs text-text-muted mt-2">{formatDateShort(r.publishedAt, locale)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
