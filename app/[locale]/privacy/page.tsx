import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/lib/i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const l = locale as Locale

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
      <h1>{l === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
      <p style={{ color: '#888' }}>
        {l === 'ar'
          ? 'سيتم إضافة سياسة الخصوصية قريباً.'
          : 'Privacy policy content will be added soon.'}
      </p>
    </main>
  )
}
