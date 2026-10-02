import Link from 'next/link'
import { type Locale, t } from '@/lib/i18n'

export default function Hero({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar'
  
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 bg-purple-primary/10 border border-purple-primary/20 text-purple-primary text-xs font-body px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-primary" />
          {isAr ? 'مراجعات موثوقة' : 'Trusted Reviews'}
        </span>
        
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6 max-w-4xl mx-auto">
          {isAr ? 'دليلك الشامل لأفضل ' : 'Your Ultimate Guide to the '}
          <span className="text-gradient">{isAr ? 'المنتجات التقنية' : 'Best Tech Products'}</span>
        </h1>
        
        <p className="font-body text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-[1.8]">
          {isAr 
            ? 'نساعدك في اتخاذ القرار الصحيح قبل الشراء من خلال مراجعات دقيقة، ومقارنات شاملة، وأدلة شراء مبسطة.'
            : 'We help you make the right choice before buying with accurate reviews, comprehensive comparisons, and simplified buying guides.'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${locale}#latest`} className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base">
            {isAr ? 'تصفح أحدث المقالات' : 'Browse Latest Articles'}
          </Link>
          <Link href={`/${locale}/about`} className="w-full sm:w-auto px-8 py-3.5 text-base font-body font-semibold text-text-primary border border-dark-border rounded-md hover:bg-dark-card transition-colors">
            {t(locale, 'nav.about')}
          </Link>
        </div>
      </div>
    </section>
  )
}
