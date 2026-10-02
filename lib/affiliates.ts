/**
 * Amazon Affiliate Link Builder
 * Supports Amazon.sa (SAR) for Arabic articles and Amazon.com (USD) for English articles.
 * Affiliate tags are set per-site via environment variables.
 */

const AMAZON_SA_TAG = process.env.NEXT_PUBLIC_AMAZON_SA_TAG
const AMAZON_COM_TAG = process.env.NEXT_PUBLIC_AMAZON_COM_TAG

/**
 * Build an Amazon affiliate link from an ASIN.
 * Arabic articles → amazon.sa | English articles → amazon.com
 */
export function buildAmazonLink(asin: string, language: 'ar' | 'en'): string {
  if (language === 'ar') {
    return `https://www.amazon.sa/dp/${asin}${AMAZON_SA_TAG ? `?tag=${AMAZON_SA_TAG}` : ''}`
  }
  return `https://www.amazon.com/dp/${asin}${AMAZON_COM_TAG ? `?tag=${AMAZON_COM_TAG}` : ''}`
}

/**
 * Add affiliate tag to an existing Amazon URL.
 * Safely handles malformed URLs by returning the original.
 */
export function addAffiliateTag(url: string, language: 'ar' | 'en'): string {
  const tag = language === 'ar' ? AMAZON_SA_TAG : AMAZON_COM_TAG
  if (!tag) return url
  try {
    const u = new URL(url)
    u.searchParams.set('tag', tag)
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Check if a URL is an Amazon affiliate link (has a tag param).
 */
export function isAffiliateLink(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname.includes('amazon.') && u.searchParams.has('tag')
  } catch {
    return false
  }
}
