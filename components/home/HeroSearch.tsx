'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { type Locale, t } from '@/lib/i18n'

/** Search box shown inside the hero — sends the visitor to /{locale}/search?q=… */
export default function HeroSearch({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [q, setQ] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    if (query) router.push(`/${locale}/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="relative max-w-xl mx-auto"
    >
      <Search
        size={20}
        className="absolute top-1/2 -translate-y-1/2 start-5 text-text-muted pointer-events-none"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder={t(locale, 'search.placeholder')}
        aria-label={t(locale, 'nav.search')}
        className="w-full h-14 ps-14 pe-32 rounded-full bg-dark-card/80 backdrop-blur border border-dark-border text-text-primary placeholder:text-text-muted outline-none focus:border-purple-primary focus:ring-4 focus:ring-purple-primary/15 transition-all"
      />
      <button
        type="submit"
        className="absolute top-1.5 bottom-1.5 end-1.5 px-6 rounded-full bg-purple-primary hover:bg-purple-gradient text-white text-sm font-bold transition-colors"
      >
        {t(locale, 'nav.search')}
      </button>
    </form>
  )
}
