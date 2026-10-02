import { getTopLevelCategories, getSiteSettings } from '@/sanity/queries'
import { type Locale } from '@/lib/i18n'
import Navbar from './Navbar'

export default async function NavbarWrapper({ locale }: { locale: Locale }) {
  const [categories, settings] = await Promise.all([
    getTopLevelCategories(),
    getSiteSettings(),
  ])

  const siteName = locale === 'ar'
    ? (settings?.siteNameAr || 'موقع المدونة')
    : (settings?.siteNameEn || 'Blog Site')

  return <Navbar locale={locale} categories={categories} siteName={siteName} />
}
