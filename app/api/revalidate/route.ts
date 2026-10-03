import { revalidateTag, revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookBody = {
  _type?: string
  _id?: string
  language?: 'ar' | 'en'
  categoryRef?: string
  slug?: string
}

/** Expire a cache tag immediately (Next 16 requires the profile argument). */
const expire = (tag: string) => revalidateTag(tag, { expire: 0 })

/**
 * Sanity Webhook → On-Demand Revalidation
 *
 * Configure in Sanity: manage.sanity.io → API → Webhooks → Create webhook
 *   URL:         https://your-site.com/api/revalidate
 *   Method:      POST
 *   Trigger on:  Create, Update, Delete
 *   Drafts:      OFF (only published changes)
 *   Secret:      SAME string as SANITY_WEBHOOK_SECRET env var
 *   Projection:  { _type, _id, language, "categoryRef": category._ref, "slug": slug.current }
 *
 * Sanity signs the request body with the secret and sends it in the
 * `sanity-webhook-signature` header. We verify that signature here.
 *
 * NOTE: tag/path revalidation only takes effect on a host that supports
 * ISR (Vercel, or Cloudflare via the OpenNext adapter). On a fully static
 * deploy, use a Cloudflare Deploy Hook instead (see docs in the plan).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'SANITY_WEBHOOK_SECRET is not set' }, { status: 500 })
  }

  let body: WebhookBody | null = null

  // 1) Preferred: verify Sanity's HMAC signature
  try {
    const parsed = await parseBody<WebhookBody>(req, secret)
    if (parsed.isValidSignature) {
      body = parsed.body
    } else if (parsed.isValidSignature === false) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    } else {
      body = parsed.body
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!body?._type) {
    return NextResponse.json({ error: 'Missing _type in webhook body' }, { status: 400 })
  }

  const { _type, categoryRef, language, slug } = body

  // Revalidate only what changed
  if (_type === 'post') {
    // Listings that show many posts: home, /articles, search index, sitemap
    expire('posts')
    if (categoryRef) expire(`category-${categoryRef}`)

    if (slug && language) {
      // Targeted: only the edited article is cleared, not every article
      expire(`post-${slug}`)
      revalidatePath(`/${language}/${slug}`)
    } else {
      // Fallback (e.g. delete events carry no slug): clear all article pages
      revalidatePath('/[locale]/[slug]', 'page')
    }

    revalidatePath('/[locale]', 'page')
    revalidatePath('/[locale]/category/[categorySlug]', 'page')
    revalidatePath('/[locale]/articles', 'page')
    revalidatePath('/search-index.json')
  }

  if (_type === 'category') {
    expire('categories')
    // Categories appear in navbar/footer on every page
    revalidatePath('/', 'layout')
  }

  if (_type === 'siteSettings') {
    expire('siteSettings')
    revalidatePath('/', 'layout')
  }

  if (_type === 'author') {
    expire('authors')
    revalidatePath('/[locale]/authors/[slug]', 'page')
  }

  return NextResponse.json({ revalidated: true, type: _type, timestamp: new Date().toISOString() })
}
