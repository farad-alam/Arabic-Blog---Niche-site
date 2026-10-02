export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

export const i18n = {
  locales,
  defaultLocale,
}

/**
 * UI string translations — only for interface elements (nav, labels, buttons).
 * Article content comes from Sanity CMS, not from here.
 */
export const translations: Record<Locale, Record<string, string>> = {
  ar: {
    'site.home': 'الرئيسية',
    'nav.categories': 'الأقسام',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'article.readTime': 'دقائق قراءة',
    'article.publishedAt': 'نُشر في',
    'article.updatedAt': 'آخر تحديث',
    'article.by': 'بقلم',
    'article.relatedPosts': 'مقالات ذات صلة',
    'article.tableOfContents': 'جدول المحتويات',
    'article.prosTitle': 'المميزات',
    'article.consTitle': 'العيوب',
    'article.faqTitle': 'الأسئلة الشائعة',
    'article.backToHome': 'العودة للرئيسية',
    'affiliate.buyNow': 'اشتري الآن من أمازون',
    'affiliate.checkPrice': 'تحقق من السعر',
    'affiliate.disclosure':
      'تنبيه: تحتوي هذه المقالة على روابط تابعة. إذا اشتريت من خلال هذه الروابط، نحصل على عمولة صغيرة دون أي تكلفة إضافية عليك.',
    'category.allArticles': 'جميع المقالات',
    'category.articles': 'مقالات',
    'search.placeholder': 'ابحث هنا...',
    'footer.rights': 'جميع الحقوق محفوظة',
    'share.whatsapp': 'شارك عبر واتساب',
    'share.twitter': 'شارك عبر تويتر',
    'share.copy': 'نسخ الرابط',
    'share.copied': 'تم النسخ!',
    'pagination.next': 'التالي',
    'pagination.prev': 'السابق',
    'noContent.title': 'لا توجد مقالات بعد',
    'noContent.description': 'ترقبوا المحتوى القادم قريباً',
    'breadcrumb.home': 'الرئيسية',
  },
  en: {
    'site.home': 'Home',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'article.readTime': 'min read',
    'article.publishedAt': 'Published on',
    'article.updatedAt': 'Last updated',
    'article.by': 'By',
    'article.relatedPosts': 'Related Articles',
    'article.tableOfContents': 'Table of Contents',
    'article.prosTitle': 'Pros',
    'article.consTitle': 'Cons',
    'article.faqTitle': 'Frequently Asked Questions',
    'article.backToHome': 'Back to Home',
    'affiliate.buyNow': 'Buy on Amazon',
    'affiliate.checkPrice': 'Check Price',
    'affiliate.disclosure':
      'Disclosure: This article contains affiliate links. We may earn a small commission at no extra cost to you.',
    'category.allArticles': 'All Articles',
    'category.articles': 'articles',
    'search.placeholder': 'Search...',
    'footer.rights': 'All rights reserved',
    'share.whatsapp': 'Share on WhatsApp',
    'share.twitter': 'Share on Twitter/X',
    'share.copy': 'Copy Link',
    'share.copied': 'Copied!',
    'pagination.next': 'Next',
    'pagination.prev': 'Previous',
    'noContent.title': 'No articles yet',
    'noContent.description': 'Stay tuned for upcoming content',
    'breadcrumb.home': 'Home',
  },
}

/** Get a translated UI string by key. Returns the key itself if not found. */
export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? key
}

/** Get the locale-appropriate date formatter */
export function formatDate(date: string, locale: Locale): string {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Get the short date format */
export function formatDateShort(date: string, locale: Locale): string {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
