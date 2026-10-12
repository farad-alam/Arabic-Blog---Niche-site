'use client'

import { useState } from 'react'
import { type Locale } from '@/lib/i18n'

interface HomeFaqProps {
  locale: Locale
}

export default function HomeFaq({ locale }: HomeFaqProps) {
  const isAr = locale === 'ar'
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = isAr
    ? [
        {
          q: 'كم قوة الشفط (باسكال) التي أحتاجها لكنس الرمال الدقيقة في سيارتي؟',
          a: 'لتنظيف الغبار الخفيف وسطح المقاعد، تكفيك قوة 4,000 إلى 6,000 باسكال (Pa). أما إذا كانت سيارتك تتعرض لرمال الصحراء المتغلغلة في موكيت الأرضيات وأسفل المقاعد، فنوصي باختيار مكنسة بقوة شفط لا تقل عن 10,000 إلى 15,000 باسكال مع رأس فرك مخصص لتحريك حبيبات الرمل العالقة.',
        },
        {
          q: 'أيهما أفضل: مكنسة السيارة اللاسلكية أم السلكية بمدخل الولاعة 12V؟',
          a: 'المكانس اللاسلكية توفر حرية حركة كاملة وسهولة فائقة في الوصول إلى فتحات المكيف وجيوب الأبواب دون التقيد بسلك، وهي مثالية للتنظيف الأسبوعي السريع. بالمقابل، تتميز المكانس السلكية (12V) باستمرارية التشغيل دون القلق من نفاد شحن البطارية، وهي الخيار الأنسب للسيارات الكبيرة والعائلية.',
        },
        {
          q: 'هل ترك المكنسة اللاسلكية داخل السيارة آمن في حرارة الصيف بالسعودية؟',
          a: 'لا نوصي أبداً بترك أي أجهزة تعمل ببطاريات الليثيوم-أيون داخل مقصورة السيارة المغلقة تحت أشعة الشمس المباشرة خلال فصل الصيف، حيث قد تتجاوز درجات الحرارة داخل السيارة 60 درجة مئوية. يُفضل دائماً الاحتفاظ بالمكنسة في المنزل أو المكتب وأخذها للسيارة عند الحاجة فقط.',
        },
        {
          q: 'كيف نختبر ونقيم مكانس السيارات في كار كلين السعودية؟',
          a: 'نقوم بتقييم المكانس بناءً على 5 معايير رئيسية: قوة الشفط الفعلية المقاسة بأجهزة الضغط (وليس الأرقام الترويجية فقط)، عمر البطارية الفعلي وسرعة شحنها، كفاءة فلاتر HEPA وسهولة غسلها، الملحقات المرفقة، ومدى توفر قطع الغيار وضمان الوكيل في المملكة العربية السعودية.',
        },
      ]
    : [
        {
          q: 'What suction power (Pa) do I need for fine sand and deep cleaning?',
          a: 'For light surface dust and dashboard touch-ups, 4,000 to 6,000 Pascals (Pa) is sufficient. For desert sand embedded deep into floor mats, we strongly recommend a vacuum with at least 10,000 to 15,000 Pa paired with a stiff bristle brush attachment.',
        },
        {
          q: 'Which is better: Cordless rechargeable or 12V cigarette lighter corded?',
          a: 'Cordless models offer unmatched portability and maneuverability around tight AC vents and door pockets without tripping over wires. 12V corded models offer continuous, unlimited runtime, making them great for heavy-duty detailing of larger SUVs.',
        },
        {
          q: 'Is it safe to store cordless vacuums inside cars during Saudi summer heat?',
          a: 'We strongly advise against leaving any lithium-ion battery appliances inside parked vehicles in direct sunlight during summer, as interior cabin temperatures can exceed 60°C. Keep your vacuum indoors and bring it out when ready to clean.',
        },
        {
          q: 'How does CarClean KSA test and rate car vacuums?',
          a: 'We rate models across 5 strict benchmarks: real suction pressure, sustained battery runtime, filtration efficiency (washable HEPA filters), ergonomics/crevice attachments, and local Saudi warranty availability.',
        },
      ]

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary block mb-2">
          {isAr ? 'الأسئلة الشائعة والأدلة' : 'FAQ & GUIDES'}
        </span>
        <h2 className="font-arabic-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-text-primary">
          {isAr ? 'أسئلة شائعة حول اختيار مكنسة السيارة' : 'Frequently Asked Questions'}
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-start hover:bg-surface-raised transition-colors focus:outline-none"
                aria-expanded={isOpen}
              >
                <h3 className="font-arabic-heading font-bold text-base sm:text-lg text-text-primary">
                  {faq.q}
                </h3>
                <span className="w-8 h-8 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center shrink-0 text-text-muted">
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-text-muted leading-relaxed font-body border-t border-surface-border/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
