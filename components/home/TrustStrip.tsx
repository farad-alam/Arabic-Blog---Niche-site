import { ShieldCheck, FlaskConical, RefreshCw, Languages } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

/** "Why trust us" strip — important E-E-A-T signal for an affiliate review site. */
export default function TrustStrip({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar'
  const items = [
    {
      icon: FlaskConical,
      title: isAr ? 'مراجعات بعد التجربة' : 'Hands-on testing',
      text: isAr ? 'نقيّم الأجهزة بالاستخدام الفعلي في المطبخ.' : 'We judge appliances by real kitchen use.',
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'آراء صادقة' : 'Honest opinions',
      text: isAr ? 'نذكر العيوب قبل المميزات، دون مجاملة.' : 'We list the downsides before the perks.',
    },
    {
      icon: RefreshCw,
      title: isAr ? 'محتوى محدّث' : 'Kept up to date',
      text: isAr ? 'نراجع الأسعار والمقارنات باستمرار.' : 'Prices and comparisons are reviewed regularly.',
    },
    {
      icon: Languages,
      title: isAr ? 'بالعربية أولاً' : 'Arabic first',
      text: isAr ? 'محتوى مكتوب لقارئ الخليج والعالم العربي.' : 'Written for readers across the Arab world.',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="rounded-3xl border border-surface-border bg-gradient-to-br from-surface-raised to-surface-card p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 shadow-card">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-start gap-3">
            <span className="w-11 h-11 rounded-xl bg-brand-primary/15 border border-brand-primary/25 text-brand-primary flex items-center justify-center">
              <Icon size={22} />
            </span>
            <h3 className="font-arabic-heading font-bold text-text-primary">{title}</h3>
            <p className="text-sm text-text-muted !leading-relaxed !text-sm">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
