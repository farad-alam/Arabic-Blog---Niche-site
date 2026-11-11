'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

/** Pages that exist under the same path in both languages */
const SHARED_PATHS = new Set(['', 'about', 'privacy', 'terms', 'contact', 'disclosure', 'search', 'articles'])

/**
 * Language switcher.
 *
 * It is a real <a href> (not a button), so search engines and users without
 * JavaScript can follow it. The href is the same page in the other language when
 * the path is shared, otherwise the other language's home page.
 *
 * Article and category slugs differ per language. On those pages the click is
 * upgraded: the page's own <link rel="alternate" hreflang="..."> tag (from the
 * page metadata) holds the exact translated URL, so we go straight there.
 */
export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const nextLocale: Locale = currentLocale === 'ar' ? 'en' : 'ar'

  const rest = pathname.replace(new RegExp(`^/${currentLocale}`), '').replace(/^\//, '')
  const isShared = SHARED_PATHS.has(rest.split('/')[0] ?? '') && rest.split('/').length === 1
  const fallbackHref = isShared ? `/${nextLocale}${rest ? `/${rest}` : ''}` : `/${nextLocale}`

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    const alt = document.head.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${nextLocale}"]`
    )
    if (alt?.href) {
      try {
        const { pathname: altPath } = new URL(alt.href)
        if (altPath.startsWith(`/${nextLocale}`)) {
          e.preventDefault()
          router.push(altPath)
        }
      } catch {
        /* fall through to the normal link */
      }
    }
  }

  return (
    <Link
      href={fallbackHref}
      hrefLang={nextLocale}
      lang={nextLocale}
      onClick={onClick}
      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-body px-2 py-1 rounded-md border border-transparent hover:border-white/20"
      aria-label={currentLocale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="text-lg" aria-hidden="true">{currentLocale === 'ar' ? '🇬🇧' : '🇸🇦'}</span>
      <span className="hidden sm:inline">
        {currentLocale === 'ar' ? 'English' : 'العربية'}
      </span>
    </Link>
  )
}
