import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import type { SanityCategory, SanitySiteSettings } from '@/sanity/queries'

interface FooterProps {
  locale: Locale
  categories: SanityCategory[]
  settings: SanitySiteSettings | null
}

export default function Footer({ locale, categories, settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const siteName = locale === 'ar'
    ? (settings?.siteNameAr || 'موقع المدونة')
    : (settings?.siteNameEn || 'Blog Site')

  return (
    <footer className="bg-dark-card border-t border-dark-border pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-primary to-purple-gradient flex items-center justify-center text-white font-bold text-xl">
                {siteName.charAt(0)}
              </div>
              <span className="font-heading font-bold text-2xl text-text-primary">
                {siteName}
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-6">
              {locale === 'ar'
                ? 'موقعك الأول لمراجعات المنتجات التقنية، أدلة الشراء، والمقالات الموثوقة لمساعدتك على اتخاذ القرار الصحيح.'
                : 'Your top destination for tech product reviews, buying guides, and reliable articles to help you make the right choice.'}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {settings?.twitter && (
                <a
                  href={`https://twitter.com/${settings.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark-base border border-dark-border flex items-center justify-center text-text-muted hover:text-purple-primary hover:border-purple-primary/50 transition-all"
                  aria-label="Twitter"
                >
                  {/* Simple X icon SVG */}
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-arabic-heading font-bold text-text-primary mb-4">
              {locale === 'ar' ? 'الأقسام' : 'Categories'}
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/${locale}/category/${locale === 'ar' ? cat.slugAr.current : cat.slugEn.current}`}
                    className="text-text-muted text-sm hover:text-purple-primary transition-colors inline-flex items-center gap-2"
                  >
                    <span>{cat.icon}</span>
                    {locale === 'ar' ? cat.titleAr : cat.titleEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / About */}
          <div>
            <h4 className="font-arabic-heading font-bold text-text-primary mb-4">
              {locale === 'ar' ? 'عن الموقع' : 'About'}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/about`} className="text-text-muted text-sm hover:text-purple-primary transition-colors">
                  {locale === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-text-muted text-sm hover:text-purple-primary transition-colors">
                  {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-text-muted text-sm hover:text-purple-primary transition-colors">
                  {locale === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            © {currentYear} {siteName}. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="text-text-muted/50 text-[10px] text-center md:text-right max-w-sm">
            {locale === 'ar'
              ? 'تنويه: قد يحتوي هذا الموقع على روابط تابعة، مما يعني أننا قد نربح عمولة عند شرائك من خلالها دون أي تكلفة إضافية عليك.'
              : 'Disclosure: This site may contain affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
