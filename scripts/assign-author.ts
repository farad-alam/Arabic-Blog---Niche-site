/**
 * One-time script: Assigns "Farad Alam Foisal" as the author for all blog posts.
 * Run: npx tsx --env-file=.env.local scripts/assign-author.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-08-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function main() {
  console.log('Fetching author...')
  // Find the author "Farad Alam Foisal"
  const authors = await client.fetch<{ _id: string; firstName: string; lastName: string }[]>(
    `*[_type == "author"] { _id, firstName, lastName }`
  )

  const author = authors.find(
    (a) =>
      a.firstName?.toLowerCase().includes('farad') ||
      a.lastName?.toLowerCase().includes('foisal') ||
      a.lastName?.toLowerCase().includes('alam')
  )

  if (!author) {
    console.error('❌ Could not find author Farad Alam Foisal.')
    process.exit(1)
  }

  console.log(`✅ Found Author: ${author.firstName} ${author.lastName} (${author._id})`)

  console.log('\nFetching all posts...')
  const posts = await client.fetch<{ _id: string; title: string; author?: any }[]>(
    `*[_type == "post"] { _id, title, author }`
  )
  console.log(`Found ${posts.length} total posts.`)

  const postsToUpdate = posts.filter((p) => !p.author || p.author._ref !== author._id)
  
  if (postsToUpdate.length === 0) {
    console.log('✨ All posts already have the correct author assigned!')
    return
  }

  console.log(`Updating ${postsToUpdate.length} posts...`)
  
  const transaction = client.transaction()
  
  for (const post of postsToUpdate) {
    transaction.patch(post._id, (p) => p.set({ author: { _type: 'reference', _ref: author._id } }))
  }

  await transaction.commit()
  console.log('✨ All posts updated successfully!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
