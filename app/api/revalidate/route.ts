import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Sanity Webhook → On-Demand ISR Revalidation
 *
 * Configure in Sanity dashboard: API → Webhooks → Add Webhook
 * URL: https://your-site.com/api/revalidate
 * Secret: matches SANITY_WEBHOOK_SECRET env var
 * Trigger on: create, update, delete
 * Projection: { _type, _id, "categoryRef": category._ref }
 *
 * This replaces ISR timers. Pages only update when content actually changes.
 * Zero unnecessary server usage between publishes.
 */
export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = req.headers.get('x-sanity-webhook-secret')
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { _type?: string; _id?: string; categoryRef?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { _type, categoryRef } = body

  // Revalidate only what changed
  if (_type === 'post') {
    revalidateTag('posts')
    // Also revalidate the specific category page this post belongs to
    if (categoryRef) {
      revalidateTag(`category-${categoryRef}`)
    }
  }

  if (_type === 'category') {
    revalidateTag('categories')
  }

  if (_type === 'siteSettings') {
    revalidateTag('siteSettings')
  }

  if (_type === 'author') {
    revalidateTag('authors')
  }

  return NextResponse.json({ revalidated: true, type: _type, timestamp: new Date().toISOString() })
}
