/**
 * Amazon Affiliate Link Builder
 *
 * Tags are set in .env (not Sanity) because:
 * - They are deployment-level credentials tied to your Amazon Associates account
 * - Different niche sites need different tags — just clone the repo and change .env
 * - They never change during normal content editing
 *
 * Locale → Marketplace mapping:
 *   ar → amazon.sa (Saudi Arabia) → NEXT_PUBLIC_AMAZON_SA_TAG
 *   en → amazon.com (Global)      → NEXT_PUBLIC_AMAZON_COM_TAG
 */

const AMAZON_SA_TAG  = process.env.NEXT_PUBLIC_AMAZON_SA_TAG   // e.g. yourstore-21
const AMAZON_COM_TAG = process.env.NEXT_PUBLIC_AMAZON_COM_TAG  // e.g. yourstore-20

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getTag(language: 'ar' | 'en'): string | undefined {
  return language === 'ar' ? AMAZON_SA_TAG : AMAZON_COM_TAG
}

function getAmazonDomain(language: 'ar' | 'en'): string {
  return language === 'ar' ? 'amazon.sa' : 'amazon.com'
}

/**
 * Build an affiliate link from an Amazon ASIN (product ID).
 *
 * Usage: buildAmazonLink('B09X2CHNJC', 'ar')
 * Returns: https://www.amazon.sa/dp/B09X2CHNJC?tag=yourstore-21
 *
 * If no tag is configured in .env, the link still works — just without tracking.
 */
export function buildAmazonLink(asin: string, language: 'ar' | 'en'): string {
  const domain = getAmazonDomain(language)
  const tag    = getTag(language)
  return `https://www.${domain}/dp/${asin}${tag ? `?tag=${tag}` : ''}`
}

/**
 * Inject (or replace) the affiliate tag into an existing Amazon URL.
 *
 * Usage: addAffiliateTag('https://www.amazon.sa/dp/B09X2CHNJC', 'ar')
 * Returns: https://www.amazon.sa/dp/B09X2CHNJC?tag=yourstore-21
 *
 * Safe: if the URL is malformed or not an Amazon URL, it is returned unchanged.
 * This protects against editors pasting Amazon links without the tag.
 */
export function addAffiliateTag(url: string, language: 'ar' | 'en'): string {
  if (!url) return url
  const tag = getTag(language)
  if (!tag) return url
  try {
    const u = new URL(url)
    // Only modify actual Amazon URLs — never touch external links
    if (!u.hostname.includes('amazon.')) return url
    u.searchParams.set('tag', tag)
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Check whether a URL already has an affiliate tag.
 * Useful for debugging or logging.
 */
export function isAffiliateLink(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname.includes('amazon.') && u.searchParams.has('tag')
  } catch {
    return false
  }
}

/**
 * Smart link resolver — accepts either a raw ASIN or a full Amazon URL
 * and always returns a properly tagged affiliate link.
 *
 * Usage:
 *   resolveAffiliateUrl({ asin: 'B09X2CHNJC' }, 'ar')
 *   resolveAffiliateUrl({ affiliateUrl: 'https://amazon.sa/dp/B09X2CHNJC' }, 'ar')
 */
export function resolveAffiliateUrl(
  product: { asin?: string; affiliateUrl?: string },
  language: 'ar' | 'en'
): string | null {
  if (product.asin) {
    return buildAmazonLink(product.asin, language)
  }
  if (product.affiliateUrl) {
    return addAffiliateTag(product.affiliateUrl, language)
  }
  return null
}
