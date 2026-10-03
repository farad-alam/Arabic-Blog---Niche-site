import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { type Locale, locales, t } from '@/lib/i18n'
import { getFooterCopy, getSiteName } from '@/lib/site'
import { getSiteSettings } from '@/sanity/queries'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) return {}
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'اتصل بنا' : 'Contact Us',
    description: isAr
      ? 'تواصل معنا لأي استفسار أو اقتراح أو طلب تعاون.'
      : 'Get in touch for questions, suggestions or collaboration requests.',
    alternates: { canonical: `/${locale}/contact` },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const l = locale as Locale
  const isAr = l === 'ar'

  const settings = await getSiteSettings()
  const siteName = getSiteName(settings, l)
  const { address } = getFooterCopy(settings, l)
  const whatsapp = settings?.whatsapp?.replace(/\D/g, '')

  const cards = [
    settings?.contactEmail && {
      icon: Mail,
      label: isAr ? 'البريد الإلكتروني' : 'Email',
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
    whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: `+${whatsapp}`,
      href: `https://wa.me/${whatsapp}`,
    },
    settings?.contactPhone && {
      icon: Phone,
      label: isAr ? 'الهاتف' : 'Phone',
      value: settings.contactPhone,
      href: `tel:${settings.contactPhone.replace(/\s/g, '')}`,
    },
    address && { icon: MapPin, label: isAr ? 'العنوان' : 'Address', value: address, href: undefined },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[]

  return (
    <main className="min-h-screen bg-surface-base pb-24">
      <div className="relative overflow-hidden border-b border-surface-border">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-primary/15 blur-[110px] rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted mb-5 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-brand-primary transition-colors">
              {t(l, 'breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="text-text-primary">{t(l, 'nav.contact')}</span>
          </nav>
          <h1 className="font-arabic-heading font-bold text-3xl md:text-5xl text-text-primary mb-5">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-text-muted text-base md:text-lg leading-relaxed">
            {isAr
              ? `يسعدنا سماع رأيك. راسل فريق ${siteName} لأي سؤال أو اقتراح أو طلب تعاون، وسنرد عليك في أقرب وقت.`
              : `We'd love to hear from you. Reach the ${siteName} team with any question, suggestion or collaboration request and we'll reply as soon as we can.`}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="w-12 h-12 rounded-xl bg-brand-primary/15 border border-brand-primary/25 text-brand-primary flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-text-muted mb-1">{label}</span>
                    <span className="block text-text-primary font-medium break-words" dir="auto">
                      {value}
                    </span>
                  </span>
                </>
              )
              const cls =
                'flex items-center gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 transition-all'
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`${cls} hover:border-brand-primary/50 hover:-translate-y-0.5`}
                >
                  {body}
                </a>
              ) : (
                <div key={label} className={cls}>
                  {body}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-10 text-center">
            <p className="text-text-muted">
              {isAr
                ? 'لم تتم إضافة بيانات التواصل بعد. أضفها من Sanity ← إعدادات الموقع ← بيانات التواصل.'
                : 'No contact details yet. Add them in Sanity → Site Settings → Contact Details.'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
