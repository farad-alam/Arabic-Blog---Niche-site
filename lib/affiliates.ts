/**
 * Amazon Affiliate Link Builder
 *
 * This is a Saudi-targeted site, so EVERY Amazon link (Arabic and English pages)
 * points to the Saudi store, amazon.sa:
 *   ar → https://www.amazon.sa/dp/ASIN
 *   en → https://www.amazon.sa/-/en/dp/ASIN   (same store, English interface)
 *
 * The Associates tag is NOT hard-coded or read from the environment. It is the
 * "Amazon Associates tag" field in Sanity Studio → Site Settings → Analytics & Tools.
 * The caller reads it (getSiteSettings) and passes it in as `tag`.
 *
 * While the field is empty the links are used exactly as they are, with no tag.
 * Saving the field in Studio updates every product link through the normal
 * Sanity webhook, with no redeploy.
 */

type Language = 'ar' | 'en'

/** Clean the tag typed in Studio; empty or whitespace means "no tag". */
function cleanTag(tag?: string | null): string | undefined {
  return tag?.trim() || undefined
}

const SA_HOST = 'www.amazon.sa'

/** Hosts we treat as "the Amazon store" and move to amazon.sa. */
const AMAZON_STORE_HOST = /^(www\.)?amazon\.(com|sa)$/i

/** Paths that are product / search pages (affiliate-eligible), not help or policy pages. */
const PRODUCT_PATH = /(^|\/)(dp|gp\/product|gp\/aw\/d|s)(\/|$)/i

/**
 * Build an affiliate link from an Amazon ASIN (product ID).
 *
 * buildAmazonLink('B09X2CHNJC', 'ar') → https://www.amazon.sa/dp/B09X2CHNJC?tag=yourstore-21
 * buildAmazonLink('B09X2CHNJC', 'en') → https://www.amazon.sa/-/en/dp/B09X2CHNJC?tag=yourstore-21
 */
export function buildAmazonLink(
  asin: string,
  language: Language = 'ar',
  tag?: string | null
): string {
  const prefix = language === 'en' ? '/-/en' : ''
  const t = cleanTag(tag)
  const query = t ? `?tag=${encodeURIComponent(t)}` : ''
  return `https://${SA_HOST}${prefix}/dp/${asin}${query}`
}

/**
 * True when the URL is an Amazon product/search link that should be treated as an
 * affiliate link (tagged, nofollow, sponsored). Amazon help pages are not.
 * Short amzn.to / a.co links are also affiliate links.
 */
export function isAmazonAffiliateTarget(url: string | undefined | null): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    if (host === 'amzn.to' || host === 'a.co') return true
    if (!/(^|\.)amazon\./i.test(host)) return false
    return PRODUCT_PATH.test(u.pathname)
  } catch {
    return false
  }
}

/**
 * Normalise an editor-pasted Amazon URL:
 *  - amazon.com product links are moved to amazon.sa (English interface),
 *  - the affiliate tag is added (or replaced) when one is given.
 *
 * Non-Amazon URLs, Amazon help pages and malformed values are returned unchanged.
 */
export function addAffiliateTag(url: string, tag?: string | null): string {
  if (!url) return url
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    if (!isAmazonAffiliateTarget(url) || host === 'amzn.to' || host === 'a.co') return url
    if (!AMAZON_STORE_HOST.test(host)) return url

    // A link written for amazon.com becomes the English page of amazon.sa
    if (/amazon\.com$/i.test(host)) {
      u.hostname = SA_HOST
      if (!u.pathname.startsWith('/-/')) u.pathname = `/-/en${u.pathname}`
    }
    const t = cleanTag(tag)
    if (t) u.searchParams.set('tag', t)
    return u.toString()
  } catch {
    return url
  }
}

/** Whether a URL already carries an affiliate tag (debugging helper). */
export function isAffiliateLink(url: string): boolean {
  try {
    const u = new URL(url)
    return /amazon\./i.test(u.hostname) && u.searchParams.has('tag')
  } catch {
    return false
  }
}

/**
 * Accepts either a raw ASIN or a full Amazon URL and returns the final link.
 *
 * resolveAffiliateUrl({ asin: 'B09X2CHNJC' }, 'ar')
 * resolveAffiliateUrl({ affiliateUrl: 'https://www.amazon.com/dp/B09X2CHNJC' }, 'en')
 */
export function resolveAffiliateUrl(
  product: { asin?: string; affiliateUrl?: string },
  language: Language = 'ar',
  tag?: string | null
): string | null {
  if (product.asin) return buildAmazonLink(product.asin, language, tag)
  if (product.affiliateUrl) return addAffiliateTag(product.affiliateUrl, tag)
  return null
}
