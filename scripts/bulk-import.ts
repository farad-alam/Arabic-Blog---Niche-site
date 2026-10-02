/**
 * Bulk Import Script
 *
 * Imports 100+ articles from a JSON file into Sanity.
 * Used for AdSense bulk publishing sites.
 *
 * Usage:
 *   npx tsx scripts/bulk-import.ts --file=articles.json
 *
 * Input JSON format: see scripts/README.md
 *
 * Prerequisites:
 *   - SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN set in .env.local
 *   - Run: npm install @sanity/client tsx dotenv
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load env vars
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ArticleInput {
  title: string
  slug: string
  language: 'ar' | 'en'
  excerpt: string
  body: string          // Plain text — converted to Portable Text
  categorySlug: string  // Used to resolve the category _id
  authorSlug?: string   // Used to resolve the author _id
  publishedAt: string   // ISO date string e.g. "2026-09-30T00:00:00Z"
  mainImageUrl?: string // External image URL (Unsplash, Pexels, etc.)
  keywords?: string[]
  articleType?: 'review' | 'comparison' | 'howto' | 'listicle' | 'informational' | 'news'
  affiliateDisclosure?: boolean
  overallRating?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert plain text (paragraphs separated by double newlines) to Portable Text blocks */
function textToPortableText(text: string) {
  return text
    .split(/\n\n+/)
    .filter((para) => para.trim())
    .map((para, i) => ({
      _type: 'block',
      _key: `block_${i}_${Date.now()}`,
      style: 'normal',
      children: [{ _type: 'span', _key: `span_${i}`, text: para.trim(), marks: [] }],
      markDefs: [],
    }))
}

/** Resolve a category _id from its slug */
async function resolveCategoryId(slug: string, language: 'ar' | 'en'): Promise<string | null> {
  const field = language === 'ar' ? 'slugAr.current' : 'slugEn.current'
  const result = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && ${field} == $slug][0]{ _id }`,
    { slug }
  )
  return result?._id ?? null
}

/** Resolve an author _id from their slug */
async function resolveAuthorId(slug: string): Promise<string | null> {
  const result = await client.fetch<{ _id: string } | null>(
    `*[_type == "author" && slug.current == $slug][0]{ _id }`,
    { slug }
  )
  return result?._id ?? null
}

/** Validate a single article input */
function validateArticle(article: unknown, index: number): article is ArticleInput {
  const a = article as Record<string, unknown>
  const errors: string[] = []

  if (!a.title) errors.push('missing title')
  if (!a.slug) errors.push('missing slug')
  if (!['ar', 'en'].includes(a.language as string)) errors.push('language must be "ar" or "en"')
  if (!a.excerpt) errors.push('missing excerpt')
  if (!a.body) errors.push('missing body')
  if (!a.categorySlug) errors.push('missing categorySlug')
  if (!a.publishedAt) errors.push('missing publishedAt')

  if (errors.length > 0) {
    console.error(`❌ Article ${index}: ${errors.join(', ')}`)
    return false
  }
  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function bulkImport(filePath: string) {
  console.log(`\n📥 Reading articles from: ${filePath}\n`)

  const raw = JSON.parse(readFileSync(resolve(filePath), 'utf-8')) as unknown[]

  if (!Array.isArray(raw)) {
    console.error('❌ JSON file must be an array of articles')
    process.exit(1)
  }

  // Validate all articles first
  const valid = raw.filter((a, i) => validateArticle(a, i)) as ArticleInput[]
  console.log(`✅ ${valid.length}/${raw.length} articles passed validation\n`)

  if (valid.length === 0) {
    console.error('❌ No valid articles to import. Aborting.')
    process.exit(1)
  }

  // Cache resolved IDs to avoid repeated API calls
  const categoryCache = new Map<string, string | null>()
  const authorCache = new Map<string, string | null>()

  // Process in batches of 20 to respect Sanity rate limits
  const BATCH_SIZE = 20
  let imported = 0
  let failed = 0

  for (let i = 0; i < valid.length; i += BATCH_SIZE) {
    const batch = valid.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(valid.length / BATCH_SIZE)
    console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} articles)...`)

    const mutations = []

    for (const article of batch) {
      // Resolve category ID
      const cacheKey = `${article.categorySlug}:${article.language}`
      if (!categoryCache.has(cacheKey)) {
        const id = await resolveCategoryId(article.categorySlug, article.language)
        categoryCache.set(cacheKey, id)
        if (!id) console.warn(`  ⚠️  Category not found: "${article.categorySlug}" (${article.language})`)
      }
      const categoryId = categoryCache.get(cacheKey)

      // Resolve author ID
      const authorSlug = article.authorSlug ?? 'admin'
      if (!authorCache.has(authorSlug)) {
        const id = await resolveAuthorId(authorSlug)
        authorCache.set(authorSlug, id)
        if (!id) console.warn(`  ⚠️  Author not found: "${authorSlug}"`)
      }
      const authorId = authorCache.get(authorSlug)

      mutations.push({
        create: {
          _type: 'post',
          language: article.language,
          title: article.title,
          slug: { _type: 'slug', current: article.slug },
          excerpt: article.excerpt,
          body: textToPortableText(article.body),
          ...(categoryId ? { category: { _type: 'reference', _ref: categoryId } } : {}),
          ...(authorId ? { author: { _type: 'reference', _ref: authorId } } : {}),
          publishedAt: article.publishedAt,
          ...(article.mainImageUrl ? { mainImage: { externalUrl: article.mainImageUrl, alt: article.title } } : {}),
          ...(article.keywords?.length ? { keywords: article.keywords } : {}),
          ...(article.articleType ? { articleType: article.articleType } : {}),
          affiliateDisclosure: article.affiliateDisclosure ?? false,
          ...(article.overallRating ? { overallRating: article.overallRating } : {}),
          noIndex: false,
        },
      })
    }

    try {
      await client.mutate(mutations)
      imported += batch.length
      console.log(`  ✅ Batch ${batchNum} imported successfully`)
    } catch (err) {
      failed += batch.length
      console.error(`  ❌ Batch ${batchNum} failed:`, err)
    }

    // Rate limit: 100ms between batches
    if (i + BATCH_SIZE < valid.length) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  console.log(`\n🏁 Done! ${imported} imported, ${failed} failed.\n`)
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

const fileArg = process.argv.find((a) => a.startsWith('--file='))
if (!fileArg) {
  console.error('Usage: npx tsx scripts/bulk-import.ts --file=articles.json')
  process.exit(1)
}

bulkImport(fileArg.replace('--file=', ''))
