import { getTopLevelCategories, getSiteSettings } from '@/sanity/queries'
import { type Locale } from '@/lib/i18n'
import Footer from './Footer'

export default async function FooterWrapper({ locale }: { locale: Locale }) {
  const [categories, settings] = await Promise.all([
    getTopLevelCategories(),
    getSiteSettings(),
  ])

  return <Footer locale={locale} categories={categories} settings={settings} />
}
