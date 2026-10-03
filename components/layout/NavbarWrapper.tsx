import { getTopLevelCategories, getSiteSettings } from '@/sanity/queries'
import { type Locale } from '@/lib/i18n'
import { getSiteName } from '@/lib/site'
import Navbar from './Navbar'

export default async function NavbarWrapper({ locale }: { locale: Locale }) {
  const [categories, settings] = await Promise.all([
    getTopLevelCategories(),
    getSiteSettings(),
  ])

  return <Navbar locale={locale} categories={categories} siteName={getSiteName(settings, locale)} />
}
