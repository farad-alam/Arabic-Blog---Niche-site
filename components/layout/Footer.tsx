import Link from 'next/link'
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import { type Locale, t } from '@/lib/i18n'
import { getFooterCopy, getSiteName } from '@/lib/site'
import type { SanityCategory, SanitySiteSettings } from '@/sanity/queries'

interface FooterProps {
  locale: Locale
  categories: SanityCategory[]
  settings: SanitySiteSettings | null
}

/** Inline brand icons (lucide-react no longer ships brand logos) */
const SOCIAL_ICONS: Record<string, string> = {
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  facebook:
    'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.931-1.956 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  pinterest:
    'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z',
}

function SocialLink({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="w-10 h-10 rounded-full bg-dark-base border border-dark-border flex items-center justify-center text-text-muted hover:text-white hover:bg-purple-primary hover:border-purple-primary transition-all duration-200 hover:-translate-y-0.5"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
        <path d={SOCIAL_ICONS[name]} />
      </svg>
    </a>
  )
}

export default function Footer({ locale, categories, settings }: FooterProps) {
  const isAr = locale === 'ar'
  const year = new Date().getFullYear()
  const siteName = getSiteName(settings, locale)
  const copy = getFooterCopy(settings, locale)

  const twitterHref = settings?.twitter
    ? `https://twitter.com/${settings.twitter.replace('@', '')}`
    : undefined
  const socials: { name: string; href?: string }[] = [
    { name: 'twitter', href: twitterHref },
    { name: 'facebook', href: settings?.facebook },
    { name: 'instagram', href: settings?.instagram },
    { name: 'youtube', href: settings?.youtube },
    { name: 'tiktok', href: settings?.tiktok },
    { name: 'pinterest', href: settings?.pinterest },
  ]
  const activeSocials = socials.filter((s): s is { name: string; href: string } => Boolean(s.href))

  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, '')
  const hasContact =
    settings?.contactEmail || settings?.contactPhone || whatsappDigits || copy.address

  const linkClass = 'text-text-muted text-sm hover:text-purple-primary transition-colors'
  const headingClass = 'font-arabic-heading font-bold text-text-primary mb-5'

  return (
    <footer className="relative bg-dark-card border-t border-dark-border mt-24">
      {/* soft accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-primary/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-primary to-purple-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-primary/30">
                {siteName.charAt(0)}
              </span>
              <span className="font-heading font-bold text-2xl text-text-primary">{siteName}</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-6">{copy.about}</p>
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {activeSocials.map((s) => (
                  <SocialLink key={s.name} name={s.name} href={s.href} />
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="lg:col-span-3">
              <h4 className={headingClass}>{t(locale, 'nav.categories')}</h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={`/${locale}/category/${isAr ? cat.slugAr.current : cat.slugEn.current}`}
                      className={`${linkClass} inline-flex items-center gap-2`}
                    >
                      {cat.icon && <span>{cat.icon}</span>}
                      {isAr ? cat.titleAr : cat.titleEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pages */}
          <div className="lg:col-span-2">
            <h4 className={headingClass}>{isAr ? 'روابط مهمة' : 'Quick Links'}</h4>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/articles`} className={linkClass}>{t(locale, 'nav.articles')}</Link></li>
              <li><Link href={`/${locale}/about`} className={linkClass}>{t(locale, 'nav.about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className={linkClass}>{t(locale, 'nav.contact')}</Link></li>
              <li><Link href={`/${locale}/disclosure`} className={linkClass}>{isAr ? 'إفصاح الروابط التابعة' : 'Affiliate Disclosure'}</Link></li>
              <li><Link href={`/${locale}/privacy`} className={linkClass}>{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
              <li><Link href={`/${locale}/terms`} className={linkClass}>{isAr ? 'شروط الاستخدام' : 'Terms of Use'}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className={headingClass}>{t(locale, 'nav.contact')}</h4>
            {hasContact ? (
              <ul className="space-y-3 text-sm text-text-muted">
                {settings?.contactEmail && (
                  <li className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 text-purple-primary shrink-0" />
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-purple-primary transition-colors break-all">
                      {settings.contactEmail}
                    </a>
                  </li>
                )}
                {settings?.contactPhone && (
                  <li className="flex items-start gap-3">
                    <Phone size={16} className="mt-0.5 text-purple-primary shrink-0" />
                    <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} dir="ltr" className="hover:text-purple-primary transition-colors">
                      {settings.contactPhone}
                    </a>
                  </li>
                )}
                {whatsappDigits && (
                  <li className="flex items-start gap-3">
                    <MessageCircle size={16} className="mt-0.5 text-purple-primary shrink-0" />
                    <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-primary transition-colors">
                      WhatsApp
                    </a>
                  </li>
                )}
                {copy.address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 text-purple-primary shrink-0" />
                    <span>{copy.address}</span>
                  </li>
                )}
              </ul>
            ) : (
              <Link href={`/${locale}/contact`} className={linkClass}>
                {isAr ? 'تواصل معنا ←' : 'Get in touch →'}
              </Link>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            © {year} {siteName}. {copy.copyright}
          </p>
          <p className="text-text-muted/60 text-[11px] text-center md:text-end max-w-md leading-relaxed">
            {isAr
              ? 'تنويه: قد يحتوي هذا الموقع على روابط تابعة، مما يعني أننا قد نربح عمولة عند شرائك من خلالها دون أي تكلفة إضافية عليك.'
              : 'Disclosure: This site may contain affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
