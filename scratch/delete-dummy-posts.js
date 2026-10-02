/**
 * Script to delete all blog posts except "why-google-cant-find-your-business"
 * Run: node --env-file=.env.local scratch/delete-dummy-posts.js
 */
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

async function deleteDummyPosts() {
  console.log('Fetching posts to delete...')
  
  // Fetch all posts EXCEPT the one we want to keep
  const query = `*[_type == "post" && slug.current != "why-google-cant-find-your-business"]{ _id, title, "slug": slug.current }`
  const postsToDelete = await client.fetch(query)

  if (postsToDelete.length === 0) {
    console.log('No dummy posts found to delete!')
    return
  }

  console.log(`Found ${postsToDelete.length} dummy posts. Deleting...`)

  let success = 0
  let failed = 0

  for (const post of postsToDelete) {
    try {
      await client.delete(post._id)
      console.log(`✅ Deleted: ${post.title} (${post.slug})`)
      success++
    } catch (err) {
      console.error(`❌ Failed to delete: ${post.title}`, err.message)
      failed++
    }
  }

  console.log(`\n🎉 Deletion complete! ${success} deleted, ${failed} failed.`)
}

deleteDummyPosts()
