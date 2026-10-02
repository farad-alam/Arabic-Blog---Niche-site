const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_SECRET_TOKEN, 
})

async function populate() {
  try {
    const doc = {
      _id: 'siteSettings',
      _type: 'siteSettings',
      seoTitle: 'Web Design & Development for Businesses | MotionBite',
      seoDescription: 'MotionBite builds fast, professional websites for businesses and restaurants — design and development handled end to end. Delivered in 14 days. Get your free audit today.',
      seoKeywords: [
        'web design and development for businesses',
        'web design for businesses',
        'web development for businesses',
        'website design and development agency',
        'affordable web design and development',
        'restaurant website design and development',
        'custom web development for business',
        'business web design agency',
        'professional website development',
        'fast website design and development',
      ],
    }

    console.log('Creating siteSettings document...')
    // Use createIfNotExists so we don't overwrite if the user already did it
    const result = await client.createIfNotExists(doc)
    console.log('Success:', result._id)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

populate()
