'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

/** Pages that exist under the same path in both languages */
const SHARED_PATHS = new Set(['', 'about', 'privacy', 'terms', 'contact', 'disclosure', 'articles', 'search'])

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar'
    // Article / category slugs differ per language, so only keep the path for
    // pages that are identical in both languages; otherwise go to the other home.
    const rest = pathname.replace(new RegExp(`^/${currentLocale}`), '').replace(/^\//, '')
    const target = SHARED_PATHS.has(rest.split('/')[0] ?? '') && rest.split('/').length === 1
      ? `/${nextLocale}${rest ? `/${rest}` : ''}`
      : `/${nextLocale}`
    router.push(target)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-body px-2 py-1 rounded-md border border-transparent hover:border-white/20"
      aria-label="Switch Language"
    >
      <span className="text-lg">{currentLocale === 'ar' ? '🇬🇧' : '🇸🇦'}</span>
      <span className="hidden sm:inline">
        {currentLocale === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  )
}
