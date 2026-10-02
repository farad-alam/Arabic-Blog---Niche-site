/**
 * One-time migration: seeds Sanity with the existing blog posts from data/blog-posts.ts
 *
 * Usage (after setting env vars):
 *   npx tsx scripts/migrate-posts.ts
 */

import { createClient } from '@sanity/client'
import { blogPosts } from '../data/blog-posts'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-08-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

// Map legacy tag names to category titles
const categoryMap: Record<string, string> = {
  'Web Design': 'Web Design',
  'Pricing': 'Pricing',
  'SEO': 'SEO',
  'Restaurant': 'Restaurant',
  'Strategy': 'Strategy',
  'Process': 'Process',
  'Case Study': 'Case Study',
  'Copywriting': 'Copywriting',
}

async function getOrCreateCategory(title: string): Promise<string> {
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "category" && title == $title]{ _id }`,
    { title }
  )
  if (existing.length > 0) return existing[0]._id

  const created = await client.create({
    _type: 'category',
    title,
    slug: { _type: 'slug', current: title.toLowerCase().replace(/\s+/g, '-') },
  })
  console.log(`  ✅ Created category: ${title}`)
  return created._id
}

function sectionsToPortableText(sections: { heading?: string; body: string }[]) {
  const blocks: object[] = []

  for (const section of sections) {
    if (section.heading) {
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).slice(2),
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: Math.random().toString(36).slice(2),
            text: section.heading,
            marks: [],
          },
        ],
        markDefs: [],
      })
    }

    blocks.push({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2),
          text: section.body,
          marks: [],
        },
      ],
      markDefs: [],
    })
  }

  return blocks
}

async function migrate() {
  console.log(`\n🚀 Starting migration of ${blogPosts.length} posts...\n`)

  for (const post of blogPosts) {
    console.log(`→ Migrating: "${post.title}"`)

    const categoryTitle = categoryMap[post.tag] ?? post.tag
    const categoryId = await getOrCreateCategory(categoryTitle)

    const doc = {
      _type: 'post',
      _id: `migrated-${post.slug}`,
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt,
      publishedAt: new Date(post.date).toISOString(),
      category: { _type: 'reference', _ref: categoryId },
      keywords: [post.tag.toLowerCase(), 'web design', 'small business', 'MotionBite'],
      body: sectionsToPortableText(post.sections),
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ Done: /blog/${post.slug}`)
  }

  console.log(`\n✨ Migration complete! ${blogPosts.length} posts created in Sanity.\n`)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
