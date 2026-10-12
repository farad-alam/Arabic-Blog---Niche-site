import Link from 'next/link'
import { type Locale } from '@/lib/i18n'

interface TopPicksRibbonProps {
  locale: Locale
}

export default function TopPicksRibbon({ locale }: TopPicksRibbonProps) {
  const isAr = locale === 'ar'

  const picks = [
    {
      badge: isAr ? '🥇 الأفضل على الإطلاق' : '🥇 Best Overall',
      badgeClass: 'bg-amber-400 text-stone-950',
      title: isAr ? 'مكنسة يوفي المحمولة HomeVac H30' : 'eufy HomeVac H30 Cordless Handheld',
      specs: isAr ? 'قوة شفط 16,000 باسكال • وزن 800 جم • بطارية 20 دقيقة' : '16kPa Suction • 800g Weight • 20min Battery',
      verdict: isAr ? 'أقوى توازن بين الشفط الفعلي وسهولة الوصول للأماكن الضيقة بالسيارة.' : 'Best balance of high suction power and tight interior accessibility.',
      rating: '4.8',
      link: `/${locale}/cordless-car-vacuum`,
    },
    {
      badge: isAr ? '💰 الأفضل قيمة وسعراً' : '💰 Best Budget Value',
      badgeClass: 'bg-emerald-500 text-white',
      title: isAr ? 'مكنسة بيسوس اللاسلكية A2 Pro' : 'Baseus A2 Pro Car Vacuum Cleaner',
      specs: isAr ? 'قوة شفط 6,000 باسكال • فلتر HEPA مزدوج • شحن Type-C' : '6kPa Suction • Dual HEPA Filter • Type-C Fast Charge',
      verdict: isAr ? 'السعر الاقتصادي الأفضل للتنظيف اليومي السريع وفتات المقاعد.' : 'The most reliable budget option for daily touch-ups and seat crumbs.',
      rating: '4.6',
      link: `/${locale}/best-car-vacuum`,
    },
    {
      badge: isAr ? '👑 الخيار الفاخر' : '👑 Best Premium',
      badgeClass: 'bg-purple-600 text-white',
      title: isAr ? 'مكنسة بلاك آند ديكر للسيارات Dustbuster' : 'BLACK+DECKER Dustbuster Auto 12V',
      specs: isAr ? 'تشغيل مستمر عبر ولاعة السيارة • خزان 560 مل • سلك 5 أمتار' : '12V Continuous Power • 560ml Bin • 5m Long Cable',
      verdict: isAr ? 'قوة لا تنفد من البطارية لتنظيف الشاحنات والسيارات العائلية الكبيرة.' : 'Non-stop runtime directly from the 12V port for SUVs and large families.',
      rating: '4.7',
      link: `/${locale}/car-vacuum`,
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
          {isAr ? 'اختيارات الخبراء' : "EDITOR'S BENCHMARK"}
        </span>
        <h2 className="font-arabic-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-text-primary">
          {isAr ? 'أفضل مكانس السيارات ترشيحاً لعام 2026' : 'Top Recommended Car Vacuums for 2026'}
        </h2>
        <p className="font-body text-text-muted text-sm sm:text-base mt-2">
          {isAr
            ? 'مبنية على تجارب قياس الشفط الفعلي وعمر البطارية والتحمل لأجواء المملكة.'
            : 'Based on lab suction tests, battery endurance, and durability in harsh climate conditions.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {picks.map((pick, i) => (
          <div
            key={i}
            className="flex flex-col bg-surface-card rounded-2xl border border-surface-border p-6 hover:border-brand-primary/50 hover:shadow-card-hover transition-all duration-300 relative"
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${pick.badgeClass}`}>
                {pick.badge}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-text-primary">
                <span className="text-amber-400">★</span>
                <span>{pick.rating}</span>
              </span>
            </div>

            {/* Model Name */}
            <h3 className="font-arabic-heading font-bold text-lg text-text-primary mb-2">
              {pick.title}
            </h3>

            {/* Specs */}
            <p className="text-xs text-brand-primary font-medium mb-3">
              {pick.specs}
            </p>

            {/* Verdict */}
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6 flex-1">
              {pick.verdict}
            </p>

            {/* Link */}
            <Link
              href={pick.link}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white font-bold text-xs py-3 rounded-xl transition-colors"
            >
              <span>{isAr ? 'قراءة المراجعة والمواصفات' : 'Read Full Review'}</span>
              <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true">
                {isAr ? '←' : '→'}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
