import { revalidateTag, revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookBody = {
  _type?: string
  _id?: string
  language?: 'ar' | 'en'
  categoryRef?: string
}

/**
 * Sanity Webhook → On-Demand Revalidation
 *
 * Configure in Sanity: manage.sanity.io → API → Webhooks → Create webhook
 *   URL:         https://your-site.com/api/revalidate
 *   Method:      POST
 *   Trigger on:  Create, Update, Delete
 *   Drafts:      OFF (only published changes)
 *   Secret:      SAME string as SANITY_WEBHOOK_SECRET env var
 *   Projection:  { _type, _id, language, "categoryRef": category._ref }
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

  const { _type, categoryRef, language } = body

  // Revalidate only what changed
  if (_type === 'post') {
    // @ts-ignore - Next.js typing quirk: revalidateTag signature differs between versions
    revalidateTag('posts')
    if (categoryRef) {
      // @ts-ignore
      revalidateTag(`category-${categoryRef}`)
    }
    revalidatePath('/[locale]', 'page')
    revalidatePath('/[locale]/[slug]', 'page')
    revalidatePath('/[locale]/category/[categorySlug]', 'page')
    if (language) revalidatePath(`/${language}`)
  }

  if (_type === 'category') {
    // @ts-ignore
    revalidateTag('categories')
    // Categories appear in navbar/footer on every page
    revalidatePath('/', 'layout')
  }

  if (_type === 'siteSettings') {
    // @ts-ignore
    revalidateTag('siteSettings')
    revalidatePath('/', 'layout')
  }

  if (_type === 'author') {
    // @ts-ignore
    revalidateTag('authors')
    revalidatePath('/[locale]/authors/[slug]', 'page')
  }

  return NextResponse.json({ revalidated: true, type: _type, timestamp: new Date().toISOString() })
}
