'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar'
    // Replace the leading locale segment in the path
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`)
    router.push(newPath || `/${nextLocale}`)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-body px-2 py-1 rounded-md border border-transparent hover:border-dark-border"
      aria-label="Switch Language"
    >
      <span className="text-lg">{currentLocale === 'ar' ? '🇬🇧' : '🇸🇦'}</span>
      <span className="hidden sm:inline">
        {currentLocale === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  )
}
