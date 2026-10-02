/**
 * One-time script: updates the "Farad Alam Foisal" author bio in Sanity
 * Run: npx tsx --env-file=.env.local scripts/update-author-bio.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-08-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// ── Short bio (under 200 chars) ──────────────────────────────────────────────
const SHORT_BIO =
  "Web designer & developer with 6+ years helping businesses get found on Google. CEO of MotionBite. I build websites that actually bring in customers."

// ── Full bio in Sanity Portable Text format ──────────────────────────────────
function para(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 9), text, marks: [] }],
  }
}

const FULL_BIO = [
  para(
    "I'm Farad Alam Foisal, founder and CEO of MotionBite — a web design and development agency based in Rajshahi, Bangladesh. I've spent the last 6+ years helping businesses across South Asia and globally build websites that don't just look good, but actually rank on Google and convert visitors into paying customers. From dental clinics and fitness gyms to e-commerce stores, vehicle repair shops, and travel agencies, I've worked across diverse industries to build digital experiences that drive real revenue."
  ),
  para(
    "My work sits at the intersection of web design, conversion optimisation, and SEO. I specialise in building fast, modern websites using Next.js and React — the same technology stack used by companies like Netflix and Airbnb — delivered to business owners at a price that makes sense for their budget. Every site I build is engineered from day one to load in under 2 seconds, pass Google's Core Web Vitals, and be indexed correctly by search engines."
  ),
  para(
    "The work I'm most proud of? A local shop owner whose MotionBite website generated $12,000 in new sales within 90 days of launch. Or the restaurant that went from invisible on Google to ranking on the first page for their city within four months. These aren't flukes — they're the result of combining clean code, smart SEO, and design that actually guides users to take action."
  ),
  para(
    "I write on this blog to share everything I've learned about web design, SEO, and digital strategy in plain English — no jargon, no gatekeeping. If you're a business owner who wants to understand why your website isn't showing up on Google, or what a professional website actually costs, these guides are written for you."
  ),
]

async function main() {
  // Find the author document
  const authors = await client.fetch<{ _id: string; firstName: string; lastName: string }[]>(
    `*[_type == "author"] { _id, firstName, lastName }`
  )

  console.log('Found authors:', authors.map((a) => `${a.firstName} ${a.lastName}`).join(', '))

  const author = authors.find(
    (a) =>
      a.firstName?.toLowerCase().includes('farad') ||
      a.lastName?.toLowerCase().includes('foisal') ||
      a.lastName?.toLowerCase().includes('alam')
  )

  if (!author) {
    console.error('❌ Could not find author. Found:', authors)
    process.exit(1)
  }

  console.log(`\n✅ Found: ${author.firstName} ${author.lastName} (${author._id})`)
  console.log('Updating short bio and full bio...')

  await client
    .patch(author._id)
    .set({
      shortBio: SHORT_BIO,
      fullBio: FULL_BIO,
    })
    .commit()

  console.log('✨ Author bio updated successfully!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
